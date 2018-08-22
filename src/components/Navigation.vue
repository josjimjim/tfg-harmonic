<template>
  <div>
    <nav class="navbar is-transparent">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">
          <img src="/static/harmonic-logo.png" alt="TFG - Harmonic" width="112" height="28">
        </router-link>
        <div @click="toggleActive" :class="{'is-active': isActive}" class="navbar-burger burger" data-target="navbarExampleTransparentExample">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="navbarExampleTransparentExample" :class="{'is-active': isActive}" class="navbar-menu">
        <div class="navbar-start">
          <router-link to="/" class="navbar-item">
            Home
          </router-link>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              2D
            </a>
            <div class="navbar-dropdown is-boxed">
              <router-link to="/pendulum/simple" class="navbar-item">
                Simple pendulum
              </router-link>
              <router-link to="/pendulum/double" class="navbar-item">
                Double pendulum
              </router-link>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              3D
            </a>
            <div class="navbar-dropdown is-boxed">
              <router-link to="/pendulum/spherical" class="navbar-item">
                Spherical pendulum
              </router-link>
              <router-link to="/pendulum/conical" class="navbar-item">
                Conical pendulum
              </router-link>
            </div>
          </div>
          <router-link to="/about" class="navbar-item">
            About
          </router-link>
        </div>

        <div class="navbar-end">

        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'nav-bar',
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    toggleActive() {
      this.isActive = !this.isActive
    }
  }
}
</script>
