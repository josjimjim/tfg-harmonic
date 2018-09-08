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
            Inicio
          </router-link>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              2D
            </a>
            <div class="navbar-dropdown is-boxed">
              <router-link to="/pendulum/simple" class="navbar-item">
                Péndulo simple
              </router-link>
              <router-link to="/pendulum/spring" class="navbar-item">
                Péndulo amortiguado
              </router-link>
              <router-link to="/pendulum/cradle" class="navbar-item">
                Cuna de Newton
              </router-link>
              <router-link to="/pendulum/double" class="navbar-item">
                Péndulo doble
              </router-link>
              <router-link to="/pendulum/triple" class="navbar-item">
                Péndulo triple
              </router-link>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              3D
            </a>
            <div class="navbar-dropdown is-boxed">
              <router-link to="/pendulum/spherical" class="navbar-item">
                Péndulo esférico
              </router-link>
              <router-link to="/pendulum/conical" class="navbar-item">
                Péndulo cónico
              </router-link>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Herramientas
            </a>
            <div class="navbar-dropdown is-boxed">
              <router-link to="/tools/euler" class="navbar-item">
                Métodos numéricos
              </router-link>
              <router-link to="/tools/agm" class="navbar-item">
                Media aritmético-geométrica
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
