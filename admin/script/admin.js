/**
 * admin/script/admin
 * Main script for Admin.
 * @author Keenan Staffieri
*/

class HelloWorld {
  constructor () {
    console.log('HelloWorld class initialized.')
  }

  sayHello () {
    console.log('Hello Admin!')
  }
}

var hello = new HelloWorld()
hello.sayHello()