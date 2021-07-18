<template>
  <router-view />
</template>

<style lang="scss">
@import url("./assets/css/reset.css");

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #ededed;
  min-height: 100vh;
}

a {
  color: #da0037;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #af2d2d;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
