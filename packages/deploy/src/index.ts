import * as SimpleGit from "simple-git";
import * as Listr from "listr";
import * as inquirer from "inquirer";
import * as execa from "execa";
import * as execao from "execa-output";
import { access as accessCb, readFile as readFileCb } from "fs";
import { join, parse, resolve } from "path";
import { promisify } from "util";
import { Command, flags as Flags } from "@oclif/command";
const access = promisify(accessCb);
const readFile = promisify(readFileCb);

interface IPackage {
  name: string;
  version: string;
  private: boolean;
  location: string;
}

const isExists = async (path: string) => {
  try {
    await access(path);
    return true;
  } catch (err) {
    return false;
  }
};

const getPackageFiles = async (packages: IPackage[]) => {
  let files = {};
  const promises = packages.map(async p => {
    try {
      const file = JSON.parse(await readFile(join(p.location, "package.json"), "utf8"));
      files = {...files, [p.name]: file};
    } catch (err) {
      files = {...files, [p.name]: {}};
    }
  });
  await Promise.all(promises);
  return files;
};

const findSelf = (packages: IPackage[]) => {
  const path = resolve(__dirname, "..");
  return packages.find(p => p.location === path);
};

const objectify: (obj: any, [k, v]: any[]) => any = (obj: any, [k, v]: any[]) => (obj[k] = v, obj);

class Deploy extends Command {
  static description = "deploys matrix";

  static flags = {
    // add --version flag to show CLI version
    version: Flags.version({char: "v"}),
    help: Flags.help({char: "h"}),
    directory: Flags.string({char: "d"}),
    yes: Flags.boolean({char: "y"}),
    actions: Flags.string({char: "a"}),
    skipPull: Flags.boolean({char: "p"}),
  };

  cwd = __dirname;
  updatedFiles: string[] = [];

  async getPackages(): Promise<IPackage[]> {
    return JSON.parse(
      await execa.stdout("npx", ["lerna", "list", "--json", "--all", "--toposort", "--loglevel", "silent"]),
    );
  }

  async prepare(directory: string | undefined, skipPull: boolean, skipDetect: boolean) {
    return await new Listr([
      {
        title: "Looking for project root",
        task: async () => {
          if (directory) {
            if (await isExists(join(directory, "lerna.json"))) {
              this.cwd = directory;
              return;
            } else throw new Error("lerna.json not found in specified project root");
          }
          for (let path of [process.cwd(), __dirname]) {
            const root = parse(path).root;
            while (true) {
              if (await isExists(join(path, "lerna.json"))) {
                this.cwd = path;
                return;
              } else if (path === root) break;
              else path = resolve(path, "..");
            }
          }
          throw new Error("Project root not found. Try specifying project root with -d flag.");
        },
      },
      {
        title: "Pulling",
        enabled: () => !skipPull,
        task: async (ctx, task) => {
          ctx.updatedFiles = [];
          const git = SimpleGit(this.cwd);
          try {
            const update = await promisify(git.pull).call(git);
            if (!update.files) throw new Error("Updated files not found");
            if (!(update.files.length > 0)) {
              task.skip("Already up-to-date.");
            }
            ctx.updatedFiles = update.files;
          } catch (err) {
            throw err;
          }
        },
      },
      {
        title: "Fetching packages",
        task: async ctx => {
          const packages = await this.getPackages();
          ctx.packages = packages;

          const packageFiles = await getPackageFiles(packages);
          const packageNames = packages.map(p => p.name);

          const buildable = packageNames.filter(p => packageFiles[p].scripts && typeof packageFiles[p].scripts.build === "string");
          const deployable = packageNames.filter(p => packageFiles[p].scripts && typeof packageFiles[p].scripts.deploy === "string");

          ctx.actions = [
            {name: "Update global dependencies", value: "ci"},
            {name: "Update packages dependencies", value: "bootstrap-ci"},
            ...buildable.map(p => ({name: `Build ${p}`, value: `build_${p}`})),
            ...deployable.map(p => ({name: `Deploy ${p}`, value: `deploy_${p}`})),
          ];
          ctx.buildable = buildable;
          ctx.deployable = deployable;
        },
      },
      {
        title: "Detecting changes",
        enabled: () => !(skipPull || skipDetect),
        task: async (ctx, task) => {
          const updatedPackages = ctx.updatedFiles.reduce((acc, v) => {
            const path = resolve(this.cwd, v);
            const pkg = ctx.packages.find(p => path.startsWith(p.location));
            if (pkg) acc.push(pkg.name);
            return acc;
          }, [] as string[]);
          ctx.updatedPackages = updatedPackages;

          const defaults: string[] = [];
          if (ctx.updatedFiles.length) {
            if (ctx.updatedFiles.includes("package-lock.json")) defaults.push("ci");
            if (ctx.updatedFiles.some(e => e.endsWith("package-lock.json"))) defaults.push("bootstrap-ci");
            for (const p of ctx.buildable) {
              if (updatedPackages.includes(p)) defaults.push(`build_${p}`);
            }
            for (const p of ctx.deployable) {
              if (updatedPackages.includes(p)) defaults.push(`deploy_${p}`);
            }
          } else task.skip("No updates");

          ctx.defaults = defaults;
        },
      },
    ]).run();
  }

  async doActions(actions: string[], locations: any) {
    return await new Listr(actions.map(a => {
      if (a === "ci") {
        return {
          title: "Installing global dependencies",
          task: () => execao("npm", ["ci"], {cwd: this.cwd}),
        };
      }
      if (a === "bootstrap-ci") {
        return {
          title: "Installing packages dependencies",
          task: () => execao("npm", ["run", "bootstrap-ci"], {cwd: this.cwd}),
        };
      }
      if (a.startsWith("build_")) {
        return {
          title: `Building ${a.substring(6)}`,
          task: () => execa("npm", ["run", "--silent", "build"], {cwd: locations[a.substring(6)]}),
        };
      }
      if (a.startsWith("deploy_")) {
        return {
          title: `Deploying ${a.substring(7)}`,
          task: () => execa("npm", ["run", "--silent", "deploy"], {cwd: locations[a.substring(7)]}),
        };
      }
      return {title: `Unknown action: ${a}`, task: () => ""};
    })).run();
  }

  async run() {
    const {flags} = this.parse(Deploy);
    try {
      const ctx = await this.prepare(flags.directory, flags.skipPull, !!flags.actions);

      const defaultActions = flags.actions ? flags.actions.split(",") : ctx.defaults;

      if (!flags.skipPull) {
        if (!ctx.updatedFiles.length) this.log("No files updated. Select what you want to do.");
        else this.log("Updated files:\n" + ctx.updatedFiles.join("\n") + "\n");

        const self = findSelf(ctx.packages);
        if (self && ctx.updatedPackages.includes(self.name)) {
          const {restart} = flags.yes ? {restart: true} : await inquirer.prompt({
            type: "confirm",
            name: "restart",
            message: "This deploy tool updated. Do you want to rebuild and restart it now?",
            default: true,
          });
          if (restart) {
            if (flags.yes) this.log("Deploy tool updated. Restarting...");
            await execa("npm", ["run", "--silent", "build"], {cwd: self.location});
            const args = ["--skipPull", "--actions=" + defaultActions.join(",")];
            if (flags.yes) args.push("--yes");
            if (flags.directory) args.push("--directory=" + flags.directory);
            await require("../lib").run(args).catch(require("@oclif/errors/handle"));
            return;
          }
        }
      }

      const {actions}: {actions: string[]} = flags.yes ? {actions: defaultActions} : await inquirer.prompt([{
        type: "checkbox",
        name: "actions",
        message: "Actions:",
        choices: ctx.actions,
        default: defaultActions,
      }]);

      if (!actions.length) {
        this.log("No actions selected.");
        return;
      }

      const locations = ctx.packages.map(p => [p.name, p.location]).reduce(objectify, {});

      let time = Date.now();
      await this.doActions(actions, locations);
      time = (Date.now() - time) / 1000;
      this.log(`Finished in ${time}s`);
    } catch (err) {
      this.error(err.message);
    }
  }
}

export = Deploy;
