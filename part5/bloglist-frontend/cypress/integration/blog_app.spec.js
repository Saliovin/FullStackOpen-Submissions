describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'John Carmack',
      username: 'testUser',
      password: 'mytestpassword'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3002')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('testUser')
      cy.get('#password').type('mytestpassword')
      cy.get('#login-button').click()
      cy.contains('John Carmack logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('incorrectUser')
      cy.get('#password').type('testing')
      cy.get('#login-button').click()
      cy.contains('Invalid username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testUser', password: 'mytestpassword' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('New Blog')
      cy.get('#author').type('Mary Fell')
      cy.get('#url').type('newblog.com')
      cy.get('#new-blog-button').click()
      cy.contains('New Blog Mary Fell')
    })

    describe('When a blog exists', function () {
      beforeEach(function () {
        cy.contains('new blog').click()
        cy.get('#title').type('New Blog')
        cy.get('#author').type('Mary Fell')
        cy.get('#url').type('newblog.com')
        cy.get('#new-blog-button').click()
        cy.contains('New Blog Mary Fell').as('testBlog')
      })

      it('A blog can be liked', function () {
        cy.get('@testBlog').contains('view').click()
        cy.get('@testBlog').find('button').contains('like').click()
        cy.get('@testBlog').contains('likes 1')
      })

      it('A blog can be deleted by owner', function () {
        cy.get('@testBlog').contains('view').click()
        cy.get('@testBlog').find('button').contains('remove').click()
        cy.contains('New Blog Mary Fell').should('not.exist')
      })
    })

    describe('When multiple blogs exist', function () {
      beforeEach(function () {
        const blogList = [
          { title: 'Blog 1', author: 'Author 1', url: 'Url 1' },
          { title: 'Blog 2', author: 'Author 2', url: 'Url 2' },
          { title: 'Blog 3', author: 'Author 3', url: 'Url 3' }
        ]

        blogList.forEach(blog => {
          cy.newBlog(blog)
        })

        cy.get('.blogPost').as('blogList')
        cy.get('@blogList').contains('Blog 1 Author 1').as('blog1')
        cy.get('@blogList').contains('Blog 2 Author 2').as('blog2')
        cy.get('@blogList').contains('Blog 3 Author 3').as('blog3')
      })

      it('Blogs are ordered by likes', function() {
        cy.get('@blog3').contains('view').click()
        cy.get('@blog3').find('button').contains('like').click()
        cy.get('@blog3').contains('likes 1')
        cy.get('@blog3').find('button').contains('like').click()
        cy.get('@blog2').contains('view').click()
        cy.get('@blog2').find('button').contains('like').click()
        cy.get('@blog2').contains('likes 1')
        cy.get('.blogPost').eq(0).contains('Blog 3 Author 3')
        cy.get('.blogPost').eq(1).contains('Blog 2 Author 2')
        cy.get('.blogPost').eq(2).contains('Blog 1 Author 1')
      })
    })
  })
})