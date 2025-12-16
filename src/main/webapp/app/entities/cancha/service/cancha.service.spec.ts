import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ICancha } from '../cancha.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../cancha.test-samples';

import { CanchaService } from './cancha.service';

const requireRestSample: ICancha = {
  ...sampleWithRequiredData,
};

describe('Cancha Service', () => {
  let service: CanchaService;
  let httpMock: HttpTestingController;
  let expectedResult: ICancha | ICancha[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CanchaService);
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

    it('should create a Cancha', () => {
      const cancha = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(cancha).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cancha', () => {
      const cancha = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(cancha).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cancha', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cancha', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Cancha', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCanchaToCollectionIfMissing', () => {
      it('should add a Cancha to an empty array', () => {
        const cancha: ICancha = sampleWithRequiredData;
        expectedResult = service.addCanchaToCollectionIfMissing([], cancha);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cancha);
      });

      it('should not add a Cancha to an array that contains it', () => {
        const cancha: ICancha = sampleWithRequiredData;
        const canchaCollection: ICancha[] = [
          {
            ...cancha,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCanchaToCollectionIfMissing(canchaCollection, cancha);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cancha to an array that doesn't contain it", () => {
        const cancha: ICancha = sampleWithRequiredData;
        const canchaCollection: ICancha[] = [sampleWithPartialData];
        expectedResult = service.addCanchaToCollectionIfMissing(canchaCollection, cancha);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cancha);
      });

      it('should add only unique Cancha to an array', () => {
        const canchaArray: ICancha[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const canchaCollection: ICancha[] = [sampleWithRequiredData];
        expectedResult = service.addCanchaToCollectionIfMissing(canchaCollection, ...canchaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cancha: ICancha = sampleWithRequiredData;
        const cancha2: ICancha = sampleWithPartialData;
        expectedResult = service.addCanchaToCollectionIfMissing([], cancha, cancha2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cancha);
        expect(expectedResult).toContain(cancha2);
      });

      it('should accept null and undefined values', () => {
        const cancha: ICancha = sampleWithRequiredData;
        expectedResult = service.addCanchaToCollectionIfMissing([], null, cancha, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cancha);
      });

      it('should return initial array if no Cancha is added', () => {
        const canchaCollection: ICancha[] = [sampleWithRequiredData];
        expectedResult = service.addCanchaToCollectionIfMissing(canchaCollection, undefined, null);
        expect(expectedResult).toEqual(canchaCollection);
      });
    });

    describe('compareCancha', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCancha(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 16283 };
        const entity2 = null;

        const compareResult1 = service.compareCancha(entity1, entity2);
        const compareResult2 = service.compareCancha(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 16283 };
        const entity2 = { id: 15070 };

        const compareResult1 = service.compareCancha(entity1, entity2);
        const compareResult2 = service.compareCancha(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 16283 };
        const entity2 = { id: 16283 };

        const compareResult1 = service.compareCancha(entity1, entity2);
        const compareResult2 = service.compareCancha(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
