import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IHorario } from '../horario.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../horario.test-samples';

import { HorarioService } from './horario.service';

const requireRestSample: IHorario = {
  ...sampleWithRequiredData,
};

describe('Horario Service', () => {
  let service: HorarioService;
  let httpMock: HttpTestingController;
  let expectedResult: IHorario | IHorario[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(HorarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Horario', () => {
      const horario = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(horario).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Horario', () => {
      const horario = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(horario).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Horario', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Horario', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Horario', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHorarioToCollectionIfMissing', () => {
      it('should add a Horario to an empty array', () => {
        const horario: IHorario = sampleWithRequiredData;
        expectedResult = service.addHorarioToCollectionIfMissing([], horario);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(horario);
      });

      it('should not add a Horario to an array that contains it', () => {
        const horario: IHorario = sampleWithRequiredData;
        const horarioCollection: IHorario[] = [
          {
            ...horario,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHorarioToCollectionIfMissing(horarioCollection, horario);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Horario to an array that doesn't contain it", () => {
        const horario: IHorario = sampleWithRequiredData;
        const horarioCollection: IHorario[] = [sampleWithPartialData];
        expectedResult = service.addHorarioToCollectionIfMissing(horarioCollection, horario);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(horario);
      });

      it('should add only unique Horario to an array', () => {
        const horarioArray: IHorario[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const horarioCollection: IHorario[] = [sampleWithRequiredData];
        expectedResult = service.addHorarioToCollectionIfMissing(horarioCollection, ...horarioArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const horario: IHorario = sampleWithRequiredData;
        const horario2: IHorario = sampleWithPartialData;
        expectedResult = service.addHorarioToCollectionIfMissing([], horario, horario2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(horario);
        expect(expectedResult).toContain(horario2);
      });

      it('should accept null and undefined values', () => {
        const horario: IHorario = sampleWithRequiredData;
        expectedResult = service.addHorarioToCollectionIfMissing([], null, horario, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(horario);
      });

      it('should return initial array if no Horario is added', () => {
        const horarioCollection: IHorario[] = [sampleWithRequiredData];
        expectedResult = service.addHorarioToCollectionIfMissing(horarioCollection, undefined, null);
        expect(expectedResult).toEqual(horarioCollection);
      });
    });

    describe('compareHorario', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHorario(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 1086 };
        const entity2 = null;

        const compareResult1 = service.compareHorario(entity1, entity2);
        const compareResult2 = service.compareHorario(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 1086 };
        const entity2 = { id: 20541 };

        const compareResult1 = service.compareHorario(entity1, entity2);
        const compareResult2 = service.compareHorario(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 1086 };
        const entity2 = { id: 1086 };

        const compareResult1 = service.compareHorario(entity1, entity2);
        const compareResult2 = service.compareHorario(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
