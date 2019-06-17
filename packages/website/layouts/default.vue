<template>
  <div class="main">
    <div class="navbar-container">
      <nav class="navbar">
        <b-navbar-brand to="/" class="purple mx-auto">VIRTECH MATRIX</b-navbar-brand>
        <b-navbar-toggle target="nav_collapse" right></b-navbar-toggle>
        <b-collapse is-nav id="nav_collapse" class="blue text-right">
          <b-navbar-nav>
            <template v-if="!me">
              <b-nav-item to="/register">Регистрация</b-nav-item>
              <b-nav-item to="/login">Логин</b-nav-item>
            </template>
            <template v-else>
              <b-nav-item @click="logout">Выход</b-nav-item>
            </template>
          </b-navbar-nav>
        </b-collapse>
      </nav>
      <div class="nav-progress-bar">
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="content-container">
      <nuxt/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import gql from "graphql-tag";
import { query } from "@/graphql/me";

@Component({
  apollo: {
    me: {
      query: gql`{
        me {
          email
        }
      }`,
      errorPolicy: "ignore",
    },
  },
})
export default class DefaultLayout extends Vue {
  fluid = true;

  async logout() {
    await this.$apollo.mutate({
      mutation: gql`mutation {
        logout
      }`,
      update: (proxy: any) => {
        proxy.writeQuery({query, data: {
          me: null,
        }});
      },
    });
    this.$router.push("/");
  }
}
</script>

<style lang="scss">
$primary-color: #01CEFD;
$primary-color-rgb: "rgb(1,206,253)";
$secondary-color: #CF32FF;
$secondary-color-rgb: "rgb(207,55,255)";
$yellow-color: #DBE285;
$yellow-color-rgb: "rgb(219,226,133)";

@font-face {
  font-family: 'Ignis';
  src: url('../assets/fonts/Ignis_et_Glacies_Sharp.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
/* @font-face {
  font-family: 'Sanasoft';
  src: url('../assets/fonts/Sanasoft_Inset_D.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
} */
@font-face {
  font-family: 'Library';
  src: url('../assets/fonts/Library_3_am.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

html, body, #__nuxt, #__layout, .main {
  min-height: 100vh;
}
body {
  background-color: #002637;
  background: url('../assets/img/BACK11.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-attachment: fixed;
  color: $primary-color;
}

.main {
  font-family: Ignis;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navbar-container {
  width: 100%;
  max-width: 540px;
  .navbar-brand {
    font-size: 150%;
    &:hover {
      color: $primary-color !important;
    }
  }
  .navbar-toggler {
    margin-left: -54px;
    border: 0;
    border-radius: 5px;
    &:focus {
      outline: none;
    }
    .navbar-toggler-icon {
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='#{$primary-color-rgb}' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E");
    }
  }
  .nav-item {
    font-size: 6vw;
  }
  @media screen and (min-width: 540px) {
    .nav-item {
      font-size: 24px;
    }
  }
  >.nav-progress-bar{
    margin-left: 20px;
    margin-right: 20px;
    height:5px;
    border:1px solid $primary-color;
    margin-bottom: 9px;
    background: linear-gradient(to right, $primary-color 0 40%, transparent 40% 98%, $primary-color 98% 100%);
  }
}

.content-container {
  width: 100%;
  max-width: 540px;
  padding: 0 20px 50px 20px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

hr {
  border-top: 1px dashed $primary-color;
}

.custom-file-input ~ .custom-file-label::after {
  content: 'Выбрать';
}

.purple {
  color: $secondary-color;
}
.blue {
  color: $primary-color;
}
.yellow {
  color: $yellow-color;
}

h1 {
  font-family: Library;
}

.blink {
  animation-duration: 1s;
  animation-name: blink;
  animation-iteration-count: infinite;
  animation-timing-function: steps(2, start);
}
@keyframes blink {
  80% {
    visibility: hidden;
  }
}

a {
  color: inherit;
  &:hover {
    color: inherit;
  }
}
</style>
