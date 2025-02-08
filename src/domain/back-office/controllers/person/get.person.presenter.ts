import { Person } from '~backOffice/entities/person';

export abstract class GetPersonPresenter {
  private static withOnlyLegalPerson(personDTO: Person) {
    return {
      id: personDTO.id.toString(),
      name: personDTO.getName(),
      legal_person: {
        cnpj: personDTO.getLegalPerson().getCNPJ(),
      },
    };
  }

  private static withOnlyNaturalPerson(personDTO: Person) {
    return {
      id: personDTO.id.toString(),
      name: personDTO.getName(),
      natural_person: {
        cpf: personDTO.getNaturalPerson().getCPF(),
      },
    };
  }
  private static withoutBoth(personDTO: Person) {
    return {
      id: personDTO.id.toString(),
      name: personDTO.getName(),
    };
  }

  private static withLegalPersonAndNaturalPerson(personDTO: Person) {
    return {
      id: personDTO.id.toString(),
      name: personDTO.getName(),
      legal_person: {
        cnpj: personDTO.getLegalPerson().getCNPJ(),
      },
      natural_person: {
        cpf: personDTO.getNaturalPerson().getCPF(),
      },
    };
  }

  static toHttp(personDTO: Person) {
    const legalPersonExists = personDTO.getLegalPerson();
    const naturalPersonExists = personDTO.getNaturalPerson();

    if (legalPersonExists && !naturalPersonExists) {
      return this.withOnlyLegalPerson(personDTO);
    } else if (!legalPersonExists && naturalPersonExists) {
      return this.withOnlyNaturalPerson(personDTO);
    } else if (!legalPersonExists && !naturalPersonExists) {
      return this.withoutBoth(personDTO);
    } else {
      return this.withLegalPersonAndNaturalPerson(personDTO);
    }
  }
}
