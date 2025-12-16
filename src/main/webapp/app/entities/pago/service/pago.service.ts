import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPago, NewPago } from '../pago.model';

export type PartialUpdatePago = Partial<IPago> & Pick<IPago, 'id'>;

type RestOf<T extends IPago | NewPago> = Omit<T, 'fecha'> & {
  fecha?: string | null;
};

export type RestPago = RestOf<IPago>;

export type NewRestPago = RestOf<NewPago>;

export type PartialUpdateRestPago = RestOf<PartialUpdatePago>;

export type EntityResponseType = HttpResponse<IPago>;
export type EntityArrayResponseType = HttpResponse<IPago[]>;

@Injectable({ providedIn: 'root' })
export class PagoService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pagos');

  create(pago: NewPago): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pago);
    return this.http.post<RestPago>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pago: IPago): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pago);
    return this.http
      .put<RestPago>(`${this.resourceUrl}/${this.getPagoIdentifier(pago)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pago: PartialUpdatePago): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pago);
    return this.http
      .patch<RestPago>(`${this.resourceUrl}/${this.getPagoIdentifier(pago)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPago>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPago[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPagoIdentifier(pago: Pick<IPago, 'id'>): number {
    return pago.id;
  }

  comparePago(o1: Pick<IPago, 'id'> | null, o2: Pick<IPago, 'id'> | null): boolean {
    return o1 && o2 ? this.getPagoIdentifier(o1) === this.getPagoIdentifier(o2) : o1 === o2;
  }

  addPagoToCollectionIfMissing<Type extends Pick<IPago, 'id'>>(
    pagoCollection: Type[],
    ...pagosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pagos: Type[] = pagosToCheck.filter(isPresent);
    if (pagos.length > 0) {
      const pagoCollectionIdentifiers = pagoCollection.map(pagoItem => this.getPagoIdentifier(pagoItem));
      const pagosToAdd = pagos.filter(pagoItem => {
        const pagoIdentifier = this.getPagoIdentifier(pagoItem);
        if (pagoCollectionIdentifiers.includes(pagoIdentifier)) {
          return false;
        }
        pagoCollectionIdentifiers.push(pagoIdentifier);
        return true;
      });
      return [...pagosToAdd, ...pagoCollection];
    }
    return pagoCollection;
  }

  protected convertDateFromClient<T extends IPago | NewPago | PartialUpdatePago>(pago: T): RestOf<T> {
    return {
      ...pago,
      fecha: pago.fecha?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPago: RestPago): IPago {
    return {
      ...restPago,
      fecha: restPago.fecha ? dayjs(restPago.fecha) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPago>): HttpResponse<IPago> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPago[]>): HttpResponse<IPago[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
