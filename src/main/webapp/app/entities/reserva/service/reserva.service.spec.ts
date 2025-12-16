import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IReserva } from '../reserva.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../reserva.test-samples';

import { ReservaService, RestReserva } from './reserva.service';

const requireRestSample: RestReserva = {
  ...sampleWithRequiredData,
  fecha: sampleWithRequiredData.fecha?.format(DATE_FORMAT),
};

describe('Reserva Service', () => {
  let service: ReservaService;
  let httpMock: HttpTestingController;
  let expectedResult: IReserva | IReserva[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ReservaService);
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

    it('should create a Reserva', () => {
      const reserva = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(reserva).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Reserva', () => {
      const reserva = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(reserva).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Reserva', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Reserva', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Reserva', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReservaToCollectionIfMissing', () => {
      it('should add a Reserva to an empty array', () => {
        const reserva: IReserva = sampleWithRequiredData;
        expectedResult = service.addReservaToCollectionIfMissing([], reserva);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reserva);
      });

      it('should not add a Reserva to an array that contains it', () => {
        const reserva: IReserva = sampleWithRequiredData;
        const reservaCollection: IReserva[] = [
          {
            ...reserva,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReservaToCollectionIfMissing(reservaCollection, reserva);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Reserva to an array that doesn't contain it", () => {
        const reserva: IReserva = sampleWithRequiredData;
        const reservaCollection: IReserva[] = [sampleWithPartialData];
        expectedResult = service.addReservaToCollectionIfMissing(reservaCollection, reserva);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reserva);
      });

      it('should add only unique Reserva to an array', () => {
        const reservaArray: IReserva[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const reservaCollection: IReserva[] = [sampleWithRequiredData];
        expectedResult = service.addReservaToCollectionIfMissing(reservaCollection, ...reservaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reserva: IReserva = sampleWithRequiredData;
        const reserva2: IReserva = sampleWithPartialData;
        expectedResult = service.addReservaToCollectionIfMissing([], reserva, reserva2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reserva);
        expect(expectedResult).toContain(reserva2);
      });

      it('should accept null and undefined values', () => {
        const reserva: IReserva = sampleWithRequiredData;
        expectedResult = service.addReservaToCollectionIfMissing([], null, reserva, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reserva);
      });

      it('should return initial array if no Reserva is added', () => {
        const reservaCollection: IReserva[] = [sampleWithRequiredData];
        expectedResult = service.addReservaToCollectionIfMissing(reservaCollection, undefined, null);
        expect(expectedResult).toEqual(reservaCollection);
      });
    });

    describe('compareReserva', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareReserva(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 15097 };
        const entity2 = null;

        const compareResult1 = service.compareReserva(entity1, entity2);
        const compareResult2 = service.compareReserva(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 15097 };
        const entity2 = { id: 8835 };

        const compareResult1 = service.compareReserva(entity1, entity2);
        const compareResult2 = service.compareReserva(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 15097 };
        const entity2 = { id: 15097 };

        const compareResult1 = service.compareReserva(entity1, entity2);
        const compareResult2 = service.compareReserva(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
