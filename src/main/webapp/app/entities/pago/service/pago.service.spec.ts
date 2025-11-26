import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IPago } from '../pago.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../pago.test-samples';

import { PagoService, RestPago } from './pago.service';

const requireRestSample: RestPago = {
  ...sampleWithRequiredData,
  fecha: sampleWithRequiredData.fecha?.toJSON(),
};

describe('Pago Service', () => {
  let service: PagoService;
  let httpMock: HttpTestingController;
  let expectedResult: IPago | IPago[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PagoService);
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

    it('should create a Pago', () => {
      const pago = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pago).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pago', () => {
      const pago = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pago).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Pago', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pago', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Pago', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPagoToCollectionIfMissing', () => {
      it('should add a Pago to an empty array', () => {
        const pago: IPago = sampleWithRequiredData;
        expectedResult = service.addPagoToCollectionIfMissing([], pago);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pago);
      });

      it('should not add a Pago to an array that contains it', () => {
        const pago: IPago = sampleWithRequiredData;
        const pagoCollection: IPago[] = [
          {
            ...pago,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPagoToCollectionIfMissing(pagoCollection, pago);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pago to an array that doesn't contain it", () => {
        const pago: IPago = sampleWithRequiredData;
        const pagoCollection: IPago[] = [sampleWithPartialData];
        expectedResult = service.addPagoToCollectionIfMissing(pagoCollection, pago);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pago);
      });

      it('should add only unique Pago to an array', () => {
        const pagoArray: IPago[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pagoCollection: IPago[] = [sampleWithRequiredData];
        expectedResult = service.addPagoToCollectionIfMissing(pagoCollection, ...pagoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pago: IPago = sampleWithRequiredData;
        const pago2: IPago = sampleWithPartialData;
        expectedResult = service.addPagoToCollectionIfMissing([], pago, pago2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pago);
        expect(expectedResult).toContain(pago2);
      });

      it('should accept null and undefined values', () => {
        const pago: IPago = sampleWithRequiredData;
        expectedResult = service.addPagoToCollectionIfMissing([], null, pago, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pago);
      });

      it('should return initial array if no Pago is added', () => {
        const pagoCollection: IPago[] = [sampleWithRequiredData];
        expectedResult = service.addPagoToCollectionIfMissing(pagoCollection, undefined, null);
        expect(expectedResult).toEqual(pagoCollection);
      });
    });

    describe('comparePago', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePago(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 1660 };
        const entity2 = null;

        const compareResult1 = service.comparePago(entity1, entity2);
        const compareResult2 = service.comparePago(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 1660 };
        const entity2 = { id: 25202 };

        const compareResult1 = service.comparePago(entity1, entity2);
        const compareResult2 = service.comparePago(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 1660 };
        const entity2 = { id: 1660 };

        const compareResult1 = service.comparePago(entity1, entity2);
        const compareResult2 = service.comparePago(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
