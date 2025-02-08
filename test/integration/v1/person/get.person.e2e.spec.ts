import { randomUUID } from 'node:crypto';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { FactoryModule } from 'test/factories/factory.module';
import { FactoryPerson, makePerson } from 'test/factories/factory.person';
import { FactoryUser, makeUser } from 'test/factories/factory.user';
import { DatabaseService } from 'test/setup.e2e';

import { AppModule } from '~/app.module';
import { IPersonRepository } from '~/domain/back-office/repositories/person.repository';
import { AuthenticateUserService } from '~/domain/back-office/services/user/services/authenticate.user.service';

describe('GET /v1/persons/:id', () => {
  let app: INestApplication;
  let factoryUser: FactoryUser;
  let factoryPerson: FactoryPerson;

  let authenticateUserService: AuthenticateUserService;
  let personRepository: IPersonRepository;

  beforeEach(async () => {
    await DatabaseService.start();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, FactoryModule],
    }).compile();

    app = moduleRef.createNestApplication();
    factoryUser = moduleRef.get(FactoryUser);
    factoryPerson = moduleRef.get(FactoryPerson);

    authenticateUserService = moduleRef.get(AuthenticateUserService);
    personRepository = moduleRef.get(IPersonRepository);

    await app.init();
  });

  describe('Get person by id', () => {
    describe('🟢 should be able to get a person by id', () => {
      test('with correctly credentials and person id exists', async () => {
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

        const fakePerson = await factoryPerson.makePersonOnDatabase();

        const response = await request(app.getHttpServer())
          .get(`/v1/persons/${fakePerson.id.toString()}`)
          .set('Authorization', `Bearer ${access_token}`);

        expect(response.status).toEqual(200);

        const responseBodyPerson = response.body;

        expect(responseBodyPerson).toEqual({
          id: fakePerson.id.toString(),
          name: fakePerson.getName(),
          legal_person: {
            cnpj: fakePerson.getLegalPerson().getCNPJ(),
          },
          natural_person: {
            cpf: fakePerson.getNaturalPerson().getCPF(),
          },
        });
      });

      test('with correctly credentials and person id exists but person only have natural person', async () => {
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
            naturalPerson: fakePerson.getNaturalPerson(),
          },
          fakePerson.id,
          {
            createLegalPerson: false,
            createNaturalPerson: true,
          },
        );

        const response = await request(app.getHttpServer())
          .get(`/v1/persons/${fakePerson.id.toString()}`)
          .set('Authorization', `Bearer ${access_token}`);

        expect(response.status).toEqual(200);

        const responseBodyPerson = response.body;

        expect(responseBodyPerson).toEqual({
          id: fakePerson.id.toString(),
          name: fakePerson.getName(),
          natural_person: {
            cpf: fakePerson.getNaturalPerson().getCPF(),
          },
        });
      });

      test('with correctly credentials and person id exists but person only have legal person', async () => {
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
          },
          fakePerson.id,
          {
            createLegalPerson: true,
            createNaturalPerson: false,
          },
        );

        const response = await request(app.getHttpServer())
          .get(`/v1/persons/${fakePerson.id.toString()}`)
          .set('Authorization', `Bearer ${access_token}`);

        expect(response.status).toEqual(200);

        const responseBodyPerson = response.body;

        expect(responseBodyPerson).toEqual({
          id: fakePerson.id.toString(),
          name: fakePerson.getName(),
          legal_person: {
            cnpj: fakePerson.getLegalPerson().getCNPJ(),
          },
        });
      });
    });

    describe('🔴 should not be able to get a person by id', () => {
      test('with wrong credentials', async () => {
        const personId = randomUUID();

        const response = await request(app.getHttpServer())
          .get(`/v1/persons/${personId}`)
          .set('Authorization', `Bearer ${'access_token_invalid'}`);

        expect(response.statusCode).toEqual(401);
        const personRepositoryResult = await personRepository.fetchAll();

        if (personRepositoryResult.isLeft()) {
          throw personRepositoryResult.value;
        }
      });

      test('with correctly credentials but person id not exists', async () => {
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

        await factoryPerson.makePersonOnDatabase();

        const response = await request(app.getHttpServer())
          .get(`/v1/persons/${randomUUID()}`)
          .set('Authorization', `Bearer ${access_token}`);

        expect(response.status).toEqual(404);
      });
    });
  });
});
