import { faker } from '@faker-js/faker/.';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as fakerBr from 'cpf-cnpj-validator';
import * as request from 'supertest';
import { FactoryModule } from 'test/factories/factory.module';
import { FactoryPerson, makePerson } from 'test/factories/factory.person';
import { FactoryUser, makeUser } from 'test/factories/factory.user';
import { DatabaseService } from 'test/setup.e2e';

import { AppModule } from '~/app.module';
import { IPersonRepository } from '~backOffice/repositories/person.repository';
import { AuthenticateUserService } from '~backOffice/services/user/services/authenticate.user.service';

describe('POST /v1/persons', () => {
  let app: INestApplication;
  let factoryUser: FactoryUser;
  let factoryPerson: FactoryPerson;

  let authenticateUserService: AuthenticateUserService;
  let personRepository: IPersonRepository;

  beforeEach(async () => {
    await DatabaseService.start();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, FactoryModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();
    factoryUser = moduleRef.get(FactoryUser);
    factoryPerson = moduleRef.get(FactoryPerson);

    authenticateUserService = moduleRef.get(AuthenticateUserService);
    personRepository = moduleRef.get(IPersonRepository);

    await app.init();
  });

  describe('Create person', () => {
    describe('🟢 should be able to create a person', () => {
      test('with legal person and natural person', async () => {
        const fakeUser = makeUser();
        await factoryUser.makeUserOnDatabase({
          person: fakeUser.getPerson(),
          username: fakeUser.getUsername(),
          password: fakeUser.getPassword(),
        });

        const authenticateUserServiceResult =
          await authenticateUserService.execute({
            username: fakeUser.getUsername(),
            password: fakeUser.getPassword(),
          });

        if (authenticateUserServiceResult.isLeft()) {
          return authenticateUserServiceResult.value;
        }

        const { access_token } = authenticateUserServiceResult.value;

        const person = {
          name: faker.person.fullName(),
          legal_person: {
            cnpj: fakerBr.cnpj.generate(),
          },
          natural_person: {
            cpf: fakerBr.cpf.generate(),
          },
        };

        const response = await request(app.getHttpServer())
          .post('/v1/persons')
          .set('Authorization', `Bearer ${access_token}`)
          .send(person);

        expect(response.statusCode).toEqual(201);

        const responseBodyPerson = response.body;

        expect(responseBodyPerson).toEqual({
          id: expect.any(String),
          name: expect.any(String),
          legal_person: {
            cnpj: expect.any(String),
          },
          natural_person: {
            cpf: expect.any(String),
          },
        });

        const personRepositoryResult = await personRepository.getById({
          id: responseBodyPerson.id,
        });

        if (personRepositoryResult.isLeft()) {
          throw personRepositoryResult.value;
        }

        const { person: personOnDatabase } = personRepositoryResult.value;
        expect(personOnDatabase.id.toString()).toEqual(responseBodyPerson.id);
        expect(personOnDatabase.getName()).toEqual(responseBodyPerson.name);
        expect(personOnDatabase.getLegalPerson().getCNPJ()).toEqual(
          responseBodyPerson.legal_person.cnpj,
        );
        expect(personOnDatabase.getNaturalPerson().getCPF()).toEqual(
          responseBodyPerson.natural_person.cpf,
        );

        const personsRepositoryResult = await personRepository.fetchAll();

        if (personsRepositoryResult.isLeft()) {
          throw personsRepositoryResult.value;
        }

        const { persons: personsOnDatabase } = personsRepositoryResult.value;
        expect(personsOnDatabase).toHaveLength(2);
      });

      test('with only "legal person"', async () => {
        const fakeUser = makeUser();
        await factoryUser.makeUserOnDatabase({
          username: fakeUser.getUsername(),
          password: fakeUser.getPassword(),
        });

        const authenticateUserServiceResult =
          await authenticateUserService.execute({
            username: fakeUser.getUsername(),
            password: fakeUser.getPassword(),
          });

        if (authenticateUserServiceResult.isLeft()) {
          return authenticateUserServiceResult.value;
        }

        const { access_token } = authenticateUserServiceResult.value;

        const person = {
          name: faker.person.fullName(),
          legal_person: {
            cnpj: fakerBr.cnpj.generate(),
          },
        };

        const response = await request(app.getHttpServer())
          .post('/v1/persons')
          .set('Authorization', `Bearer ${access_token}`)
          .send(person);

        expect(response.statusCode).toEqual(201);

        const responseBodyPerson = response.body;

        expect(responseBodyPerson).toEqual({
          id: expect.any(String),
          name: expect.any(String),
          legal_person: {
            cnpj: expect.any(String),
          },
        });

        const personRepositoryResult = await personRepository.getById({
          id: responseBodyPerson.id,
        });

        if (personRepositoryResult.isLeft()) {
          throw personRepositoryResult.value;
        }

        const { person: personOnDatabase } = personRepositoryResult.value;
        expect(personOnDatabase.id.toString()).toEqual(responseBodyPerson.id);
        expect(personOnDatabase.getName()).toEqual(responseBodyPerson.name);
        expect(personOnDatabase.getLegalPerson().getCNPJ()).toEqual(
          responseBodyPerson.legal_person.cnpj,
        );

        const personsRepositoryResult = await personRepository.fetchAll();

        if (personsRepositoryResult.isLeft()) {
          throw personsRepositoryResult.value;
        }

        const { persons: personsOnDatabase } = personsRepositoryResult.value;
        expect(personsOnDatabase).toHaveLength(2);
      });

      test('with only "natural person"', async () => {
        const fakeUser = makeUser();
        await factoryUser.makeUserOnDatabase({
          username: fakeUser.getUsername(),
          password: fakeUser.getPassword(),
        });

        const authenticateUserServiceResult =
          await authenticateUserService.execute({
            username: fakeUser.getUsername(),
            password: fakeUser.getPassword(),
          });

        if (authenticateUserServiceResult.isLeft()) {
          return authenticateUserServiceResult.value;
        }

        const { access_token } = authenticateUserServiceResult.value;

        const person = {
          name: faker.person.fullName(),
          natural_person: {
            cpf: fakerBr.cpf.generate(),
          },
        };

        const response = await request(app.getHttpServer())
          .post('/v1/persons')
          .set('Authorization', `Bearer ${access_token}`)
          .send(person);

        expect(response.statusCode).toEqual(201);

        const responseBodyPerson = response.body;

        expect(responseBodyPerson).toEqual({
          id: expect.any(String),
          name: expect.any(String),
          natural_person: {
            cpf: expect.any(String),
          },
        });

        const personRepositoryResult = await personRepository.getById({
          id: responseBodyPerson.id,
        });

        if (personRepositoryResult.isLeft()) {
          throw personRepositoryResult.value;
        }

        const { person: personOnDatabase } = personRepositoryResult.value;
        expect(personOnDatabase.id.toString()).toEqual(responseBodyPerson.id);
        expect(personOnDatabase.getName()).toEqual(responseBodyPerson.name);
        expect(personOnDatabase.getNaturalPerson().getCPF()).toEqual(
          responseBodyPerson.natural_person.cpf,
        );

        const personsRepositoryResult = await personRepository.fetchAll();

        if (personsRepositoryResult.isLeft()) {
          throw personsRepositoryResult.value;
        }

        const { persons: personsOnDatabase } = personsRepositoryResult.value;
        expect(personsOnDatabase).toHaveLength(2);
      });
    });

    describe('🔴 should not be able o create a person', () => {
      test('with wrong credentials', async () => {
        const person = {
          name: faker.person.fullName(),
          legal_person: {
            cnpj: fakerBr.cnpj.generate(),
          },
          natural_person: {
            cpf: fakerBr.cpf.generate(),
          },
        };

        const response = await request(app.getHttpServer())
          .post('/v1/persons')
          .set('Authorization', `Bearer ${'access_token_invalid'}`)
          .send(person);

        expect(response.statusCode).toEqual(401);
        const personRepositoryResult = await personRepository.fetchAll();

        if (personRepositoryResult.isLeft()) {
          throw personRepositoryResult.value;
        }

        const { persons: personsOnDatabase } = personRepositoryResult.value;
        expect(personsOnDatabase).toHaveLength(0);
      });

      test('with invalid invalid CNPJ', async () => {
        const fakeUser = makeUser();
        await factoryUser.makeUserOnDatabase({
          person: fakeUser.getPerson(),
          username: fakeUser.getUsername(),
          password: fakeUser.getPassword(),
        });

        const authenticateUserServiceResult =
          await authenticateUserService.execute({
            username: fakeUser.getUsername(),
            password: fakeUser.getPassword(),
          });

        if (authenticateUserServiceResult.isLeft()) {
          return authenticateUserServiceResult.value;
        }

        const { access_token } = authenticateUserServiceResult.value;

        const person = {
          name: faker.person.fullName(),
          legal_person: {
            cnpj: 'INVALID_CNPJ',
          },
        };

        const response = await request(app.getHttpServer())
          .post('/v1/persons')
          .set('Authorization', `Bearer ${access_token}`)
          .send(person);

        expect(response.statusCode).toEqual(400);

        const personRepositoryResult = await personRepository.fetchAll();

        if (personRepositoryResult.isLeft()) {
          throw personRepositoryResult.value;
        }

        const { persons: personsOnDatabase } = personRepositoryResult.value;
        expect(personsOnDatabase).toHaveLength(1);
        expect(personsOnDatabase[0].id.toString()).toEqual(
          fakeUser.getPerson().id.toString(),
        );
      });

      test('with invalid invalid CPF', async () => {
        const fakeUser = makeUser();
        await factoryUser.makeUserOnDatabase({
          person: fakeUser.getPerson(),
          username: fakeUser.getUsername(),
          password: fakeUser.getPassword(),
        });

        const authenticateUserServiceResult =
          await authenticateUserService.execute({
            username: fakeUser.getUsername(),
            password: fakeUser.getPassword(),
          });

        if (authenticateUserServiceResult.isLeft()) {
          return authenticateUserServiceResult.value;
        }

        const { access_token } = authenticateUserServiceResult.value;

        const person = {
          name: faker.person.fullName(),
          natural_person: {
            cpf: 'INVALID_CPF',
          },
        };

        const response = await request(app.getHttpServer())
          .post('/v1/persons')
          .set('Authorization', `Bearer ${access_token}`)
          .send(person);

        expect(response.statusCode).toEqual(400);

        const personRepositoryResult = await personRepository.fetchAll();

        if (personRepositoryResult.isLeft()) {
          throw personRepositoryResult.value;
        }

        const { persons: personsOnDatabase } = personRepositoryResult.value;
        expect(personsOnDatabase).toHaveLength(1);
        expect(personsOnDatabase[0].id.toString()).toEqual(
          fakeUser.getPerson().id.toString(),
        );
      });

      test('with cnpj already exists', async () => {
        const fakeUser = makeUser();
        await factoryUser.makeUserOnDatabase({
          person: fakeUser.getPerson(),
          username: fakeUser.getUsername(),
          password: fakeUser.getPassword(),
        });

        const authenticateUserServiceResult =
          await authenticateUserService.execute({
            username: fakeUser.getUsername(),
            password: fakeUser.getPassword(),
          });

        if (authenticateUserServiceResult.isLeft()) {
          return authenticateUserServiceResult.value;
        }

        const { access_token } = authenticateUserServiceResult.value;

        const fakePerson = makePerson();

        await factoryPerson.makePersonOnDatabase(
          {
            name: fakePerson.getName(),
            legalPerson: fakePerson.getLegalPerson(),
            naturalPerson: fakePerson.getNaturalPerson(),
          },
          fakePerson.id,
        );

        const person = {
          name: faker.person.fullName(),
          legal_person: {
            cnpj: fakePerson.getLegalPerson().getCNPJ(),
          },
        };

        const response = await request(app.getHttpServer())
          .post('/v1/persons')
          .set('Authorization', `Bearer ${access_token}`)
          .send(person);

        expect(response.statusCode).toEqual(400);

        const personRepositoryResult = await personRepository.fetchAll();

        if (personRepositoryResult.isLeft()) {
          throw personRepositoryResult.value;
        }

        const { persons: personsOnDatabase } = personRepositoryResult.value;
        expect(personsOnDatabase).toHaveLength(2);
      });

      test('with cnpj already exists and cpf not', async () => {
        const fakeUser = makeUser();
        await factoryUser.makeUserOnDatabase({
          person: fakeUser.getPerson(),
          username: fakeUser.getUsername(),
          password: fakeUser.getPassword(),
        });

        const authenticateUserServiceResult =
          await authenticateUserService.execute({
            username: fakeUser.getUsername(),
            password: fakeUser.getPassword(),
          });

        if (authenticateUserServiceResult.isLeft()) {
          return authenticateUserServiceResult.value;
        }

        const { access_token } = authenticateUserServiceResult.value;

        const fakePerson = makePerson();

        await factoryPerson.makePersonOnDatabase(
          {
            name: fakePerson.getName(),
            legalPerson: fakePerson.getLegalPerson(),
            naturalPerson: fakePerson.getNaturalPerson(),
          },
          fakePerson.id,
        );

        const person = {
          name: faker.person.fullName(),
          legal_person: {
            cnpj: fakePerson.getLegalPerson().getCNPJ(),
          },
          natural_person: {
            cpf: fakerBr.cpf.generate(),
          },
        };

        const response = await request(app.getHttpServer())
          .post('/v1/persons')
          .set('Authorization', `Bearer ${access_token}`)
          .send(person);

        expect(response.statusCode).toEqual(400);

        const personRepositoryResult = await personRepository.fetchAll();

        if (personRepositoryResult.isLeft()) {
          throw personRepositoryResult.value;
        }

        const { persons: personsOnDatabase } = personRepositoryResult.value;
        expect(personsOnDatabase).toHaveLength(2);
      });

      test('with cpf already exists', async () => {
        const fakeUser = makeUser();
        await factoryUser.makeUserOnDatabase({
          person: fakeUser.getPerson(),
          username: fakeUser.getUsername(),
          password: fakeUser.getPassword(),
        });

        const resultAuthenticateUserService =
          await authenticateUserService.execute({
            username: fakeUser.getUsername(),
            password: fakeUser.getPassword(),
          });

        if (resultAuthenticateUserService.isLeft()) {
          throw resultAuthenticateUserService.value;
        }

        const { access_token } = resultAuthenticateUserService.value;

        const fakePerson = makePerson();

        await factoryPerson.makePersonOnDatabase(
          {
            name: fakePerson.getName(),
            legalPerson: fakePerson.getLegalPerson(),
            naturalPerson: fakePerson.getNaturalPerson(),
          },
          fakePerson.id,
        );

        const person = {
          name: faker.person.fullName(),
          natural_person: {
            cpf: fakePerson.getNaturalPerson().getCPF(),
          },
        };

        const response = await request(app.getHttpServer())
          .post('/v1/persons')
          .set('Authorization', `Bearer ${access_token}`)
          .send(person);

        expect(response.statusCode).toEqual(400);

        const personRepositoryResult = await personRepository.fetchAll();

        if (personRepositoryResult.isLeft()) {
          throw personRepositoryResult.value;
        }

        const { persons: personsOnDatabase } = personRepositoryResult.value;
        expect(personsOnDatabase).toHaveLength(2);
      });

      test('with cpf already exists and cnpj not', async () => {
        const fakeUser = makeUser();
        await factoryUser.makeUserOnDatabase({
          person: fakeUser.getPerson(),
          username: fakeUser.getUsername(),
          password: fakeUser.getPassword(),
        });

        const authenticateUserServiceResult =
          await authenticateUserService.execute({
            username: fakeUser.getUsername(),
            password: fakeUser.getPassword(),
          });

        if (authenticateUserServiceResult.isLeft()) {
          return authenticateUserServiceResult.value;
        }

        const { access_token } = authenticateUserServiceResult.value;

        const fakePerson = makePerson();

        await factoryPerson.makePersonOnDatabase(
          {
            name: fakePerson.getName(),
            legalPerson: fakePerson.getLegalPerson(),
            naturalPerson: fakePerson.getNaturalPerson(),
          },
          fakePerson.id,
        );

        const person = {
          name: faker.person.fullName(),
          legal_person: {
            cnpj: fakerBr.cnpj.generate(),
          },
          natural_person: {
            cpf: fakerBr.cpf.generate(),
          },
        };

        const response = await request(app.getHttpServer())
          .post('/v1/persons')
          .set('Authorization', `Bearer ${access_token}`)
          .send(person);

        expect(response.statusCode).toEqual(400);

        const personRepositoryResult = await personRepository.fetchAll();

        if (personRepositoryResult.isLeft()) {
          throw personRepositoryResult.value;
        }

        const { persons: personsOnDatabase } = personRepositoryResult.value;
        expect(personsOnDatabase).toHaveLength(2);
      });
    });
  });
});
