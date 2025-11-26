import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReserva, NewReserva } from '../reserva.model';

export type PartialUpdateReserva = Partial<IReserva> & Pick<IReserva, 'id'>;

type RestOf<T extends IReserva | NewReserva> = Omit<T, 'fecha'> & {
  fecha?: string | null;
};

export type RestReserva = RestOf<IReserva>;

export type NewRestReserva = RestOf<NewReserva>;

export type PartialUpdateRestReserva = RestOf<PartialUpdateReserva>;

export type EntityResponseType = HttpResponse<IReserva>;
export type EntityArrayResponseType = HttpResponse<IReserva[]>;

@Injectable({ providedIn: 'root' })
export class ReservaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reservas');

  create(reserva: NewReserva): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reserva);
    return this.http
      .post<RestReserva>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(reserva: IReserva): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reserva);
    return this.http
      .put<RestReserva>(`${this.resourceUrl}/${this.getReservaIdentifier(reserva)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(reserva: PartialUpdateReserva): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reserva);
    return this.http
      .patch<RestReserva>(`${this.resourceUrl}/${this.getReservaIdentifier(reserva)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestReserva>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestReserva[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReservaIdentifier(reserva: Pick<IReserva, 'id'>): number {
    return reserva.id;
  }

  compareReserva(o1: Pick<IReserva, 'id'> | null, o2: Pick<IReserva, 'id'> | null): boolean {
    return o1 && o2 ? this.getReservaIdentifier(o1) === this.getReservaIdentifier(o2) : o1 === o2;
  }

  addReservaToCollectionIfMissing<Type extends Pick<IReserva, 'id'>>(
    reservaCollection: Type[],
    ...reservasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reservas: Type[] = reservasToCheck.filter(isPresent);
    if (reservas.length > 0) {
      const reservaCollectionIdentifiers = reservaCollection.map(reservaItem => this.getReservaIdentifier(reservaItem));
      const reservasToAdd = reservas.filter(reservaItem => {
        const reservaIdentifier = this.getReservaIdentifier(reservaItem);
        if (reservaCollectionIdentifiers.includes(reservaIdentifier)) {
          return false;
        }
        reservaCollectionIdentifiers.push(reservaIdentifier);
        return true;
      });
      return [...reservasToAdd, ...reservaCollection];
    }
    return reservaCollection;
  }

  protected convertDateFromClient<T extends IReserva | NewReserva | PartialUpdateReserva>(reserva: T): RestOf<T> {
    return {
      ...reserva,
      fecha: reserva.fecha?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restReserva: RestReserva): IReserva {
    return {
      ...restReserva,
      fecha: restReserva.fecha ? dayjs(restReserva.fecha) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestReserva>): HttpResponse<IReserva> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestReserva[]>): HttpResponse<IReserva[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
