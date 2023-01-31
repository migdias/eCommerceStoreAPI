import { UserTable } from '../models/users'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const pepper = process.env.BCRYPT_PASSWORD as string
const saltRounds = process.env.SALT_ROUNDS as string

const userTable = new UserTable()

describe('User Model', () => {
  describe('Methods', () => {
    it('should have an index method', () => {
      expect(userTable.index).toBeDefined()
    })

    it('should have a show method', () => {
      expect(userTable.show).toBeDefined()
    })

    it('should have a create method', () => {
      expect(userTable.create).toBeDefined()
    })

    it('should have a update method', () => {
      expect(userTable.update).toBeDefined()
    })

    it('should have a delete method', () => {
      expect(userTable.delete).toBeDefined()
    })
  })
  describe('Create user method', () => {
    it('create method should add a user', async () => {
      const result = await userTable.create({
        first_name: 'Ron',
        last_name: 'Weasley',
        password: 'blimeyHermione123'
      })
      expect(result.id).toEqual(4)
      expect(result.first_name).toEqual('Ron')
      expect(result.last_name).toEqual('Weasley')
      expect(bcrypt.compareSync('blimeyHermione123' + pepper, result.password)).toBeTrue()
    })
  })

  describe('Index and Show methods', () => {
    it('index method should return a list of users', async () => {
      const result = await userTable.index()
      expect(result.length).toEqual(4)
      expect(result[0].first_name).toEqual('Harry')
      expect(result[0].last_name).toEqual('Potter')

      expect(bcrypt.compareSync('myscariscool123' + pepper, result[0].password)).toBeTrue()

      expect(result[2].first_name).toEqual('Severus')
      expect(result[2].last_name).toEqual('Snape')
      expect(bcrypt.compareSync('IMayVomit13' + pepper, result[2].password)).toBeTrue()
    })

    it('show method should return the correct user', async () => {
      const result = await userTable.show(2)
      expect(result.first_name).toEqual('Hermione')
      expect(result.last_name).toEqual('Granger')
      expect(bcrypt.compareSync('itslevioSA99' + pepper, result.password)).toBeTrue()
    })
  })

  describe('Authentication method', () => {
    it('should authenticate correctly with CORRECT password', async () => {
      const user = await userTable.authenticate(3, 'IMayVomit13')
      expect(user).toBeDefined()
      expect(user?.id).toBe(3)
    })
    it('should send null with WRONG password', async () => {
      const user = await userTable.authenticate(1, 'anotherps2')
      expect(user).toBeNull()
    })
    it('should throw no user exists error with WRONG id', async () => {
      await expectAsync(userTable.authenticate(1000, 'myownpassword123')).toBeRejectedWith(new Error('User does not exist.'))
    })
  })

  describe('Update user method', () => {
    it('updates a user', async () => {
      const updatedUser = {
        first_name: 'Ronald',
        last_name: 'Weasley',
        password: 'idontlikespiders123'
      }
      const result = await userTable.update(4, updatedUser)
      const pwdHash = bcrypt.hashSync(updatedUser.password + pepper, Number(saltRounds))

      expect(result.id).toEqual(4)
      expect(result.first_name).toEqual('Ronald')
      expect(result.last_name).toEqual('Weasley')
      expect(bcrypt.compareSync(updatedUser.password + pepper, pwdHash)).toBeTrue()
    })
  })

  describe('Delete user method', () => {
    it('throws user not exists error when trying to delete innexistant user', async () => {
      await expectAsync(userTable.delete(7)).toBeRejectedWith(new Error('User does not exist.'))
    })

    it('deleting a user should delete a user', async () => {
      const result = await userTable.delete(4)
      expect(result.first_name).toEqual('Ronald')
      expect(result.last_name).toEqual('Weasley')
      expect(bcrypt.compareSync('idontlikespiders123' + pepper, result.password)).toBeTrue()

      const wholeTable = await userTable.index()
      expect(wholeTable.length).toEqual(3)
      expect(wholeTable[1].first_name).toEqual('Hermione')
      expect(wholeTable[1].last_name).toEqual('Granger')
      expect(bcrypt.compareSync('itslevioSA99' + pepper, wholeTable[1].password)).toBeTrue()
    })
  })
})
