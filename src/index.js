import AlbumManager from '../packages/album-manager/index'

const components = {
  AlbumManager
}

const install = (Vue, options) => {
  if (install.installed) {
    return
  }
  Object.keys(components).forEach(field => {
    if (components.hasOwnProperty(field)) {
      let component = components[field]
      console.log(component.name, 'is installing')
      // Vue.component(component.name, component)
      Vue.use(component, options)
      console.log(component.name, 'has installed', Vue.$store)
    }
  })
}

export default Object.assign({}, components, {install})
