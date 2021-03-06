/**
 * buildsys/scaffolding/ComponentGenerator
 * Scaffold files for new components.
 * @author Keenan Staffieri
 */

import fs from 'fs'
import del from 'del'
import FileGenerator from './FileGenerator'
import ComponentCollection from '../scaffolding/ComponentCollection'
import Helpers from '../util/Helpers'
import pkg from '../../package.json'


class ComponentGenerator extends FileGenerator {

  static scaffold (componentRef, options=null) {

    Logger.detail(`Scaffolding files for '${componentRef}' component...`)

    // Format the page name: Uppercase letters between spaces and dashes '-'
    const componentNameFormatted = options.name ? options.name : Helpers.ucBetweenDashSpace(componentRef)

    let scriptFilename = null
    if ( ! options.noscript) {
      scriptFilename = Helpers.makeScriptName(componentRef)
    }

    let dirPath = ''
    if (options.dirPath) {
      dirPath = '/' + options.dirPath
    }

    let author = pkg.author.name
    if (options.author) {
      author = options.author
    }

    const replaceProps = [
      ['<%= COMPONENT_REF =%>',        componentRef],
      ['<%= COMPONENT_SCRIPTNAME =%>', scriptFilename],
      ['<%= COMPONENT_NAME =%>',       componentNameFormatted],
      ['<%= COMPONENT_DIRPATH =%>',    dirPath],
      ['<%= AUTHOR =%>',               author],
    ]

    // Generate View file
    this.generateFile(componentRef, 'component/component.njk', `${config.srcDir.app.components}${dirPath}`, replaceProps)

    // Generate SCSS file
    this.generateFile(componentRef, 'component/_component.scss', `${config.srcDir.app.styles}/component${dirPath}`, replaceProps, '_')

    // Generate JavaScript file
    if (scriptFilename !== null) {
      this.generateFile(scriptFilename, 'component/Component.js', `${config.srcDir.app.scripts}/component${dirPath}`, replaceProps)
    }

    // Add entry object to components collection
    this.addCollectionEntry(componentRef, componentNameFormatted, options.dirPath, scriptFilename)
  }

  static addCollectionEntry (ref, name, dirPath, scriptFilename) {

    Logger.detail('Adding component entry to collection within ./buildsys/data/components.js...')

    dirPath = dirPath ? dirPath + '/' : ''

    const componentCollectionFile = './buildsys/data/components.js'
    let scriptPathString = ''

    if (scriptFilename !== null) {
        scriptPathString = `
  scriptPath: '${dirPath}${scriptFilename}',`
    }

    fs.readFile(componentCollectionFile, 'utf8', function (err, data) {

      if (err) { return Logger.error(err) }

      const entryString = `{
  ref: '${ref}',
  name: '${name}',
  dirPath: '${dirPath}',
  scssPath: '${dirPath}${ref}',${scriptPathString}
},
// COMPONENT AUTOMATION !! DON'T TOUCH`

      const result = data.replace(/\/\/ COMPONENT AUTOMATION !! DON'T TOUCH/i, entryString)

      fs.writeFileSync(componentCollectionFile, result, 'utf8', function (err) {
          if (err) { return Logger.error(err) }
          Logger.info(`Finished writing component entry for '${ref}'.`)
      })
    })
  }

  static delete (componentRef) {

    const component = ComponentCollection.getComponentByReference(componentRef)

    return del([ `${config.srcDir.app.components}/${component.dirPath}${componentRef}.njk`,
                 `${config.srcDir.app.styles}/component/${component.dirPath}_${componentRef}.scss`,
                 `${config.srcDir.app.scripts}/component/${component.scriptPath}.js`,
    ], { force: true }).then(paths => {
      return Logger.info(`Deleted all files for ${componentRef} component.`)
    })
  }
}

export default ComponentGenerator
