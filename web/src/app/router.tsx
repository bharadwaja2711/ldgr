import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import HomePage from '../features/home/pages/HomePage'
import LoginPage from '../features/identity/pages/LoginPage'
import RegisterPage from '../features/identity/pages/RegisterPage'
import AuthenticatedPage from '../features/identity/pages/AuthenticatedPage'
import GoogleCallbackPage from '../features/identity/pages/GoogleCallbackPage'

const rootRoute = createRootRoute()

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const googleCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login/google/callback',
  component: GoogleCallbackPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: AuthenticatedPage,
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  googleCallbackRoute,
  registerRoute,
  appRoute,
])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
