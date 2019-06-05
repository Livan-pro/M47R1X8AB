export default (error: any, context: any) => {
  if (error.gqlError && error.gqlError.message.statusCode && error.gqlError.message.statusCode === 401) {
    console.log("Not authenticated");
  } else {
    console.log("%cGQL Error", "background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;", error);
  }
};
