import { Person } from '~backOffice/entities/person';

export abstract class CreatePersonPresenter {
  private static toHttpWithOnlyLegalPerson(personDTO: Person) {
    return {
      id: personDTO.id.toString(),
      name: personDTO.getName(),
      legal_person: {
        cnpj: personDTO.getLegalPerson().getCNPJ(),
      },
    };
  }

  private static toHttpWithOnlyNaturalPerson(personDTO: Person) {
    return {
      id: personDTO.id.toString(),
      name: personDTO.getName(),
      natural_person: {
        cpf: personDTO.getNaturalPerson().getCPF(),
      },
    };
  }
  private static toHttpWithoutBoth(personDTO: Person) {
    return {
      id: personDTO.id.toString(),
      name: personDTO.getName(),
    };
  }

  private static toHttpWithLegalPersonAndNaturalPerson(personDTO: Person) {
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
      return this.toHttpWithOnlyLegalPerson(personDTO);
    } else if (!legalPersonExists && naturalPersonExists) {
      return this.toHttpWithOnlyNaturalPerson(personDTO);
    } else if (!legalPersonExists && !naturalPersonExists) {
      return this.toHttpWithoutBoth(personDTO);
    } else {
      return this.toHttpWithLegalPersonAndNaturalPerson(personDTO);
    }
  }
}
