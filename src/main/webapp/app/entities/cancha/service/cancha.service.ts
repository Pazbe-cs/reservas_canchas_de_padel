import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICancha, NewCancha } from '../cancha.model';

export type PartialUpdateCancha = Partial<ICancha> & Pick<ICancha, 'id'>;

export type EntityResponseType = HttpResponse<ICancha>;
export type EntityArrayResponseType = HttpResponse<ICancha[]>;

@Injectable({ providedIn: 'root' })
export class CanchaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/canchas');

  create(cancha: NewCancha): Observable<EntityResponseType> {
    return this.http.post<ICancha>(this.resourceUrl, cancha, { observe: 'response' });
  }

  update(cancha: ICancha): Observable<EntityResponseType> {
    return this.http.put<ICancha>(`${this.resourceUrl}/${this.getCanchaIdentifier(cancha)}`, cancha, { observe: 'response' });
  }

  partialUpdate(cancha: PartialUpdateCancha): Observable<EntityResponseType> {
    return this.http.patch<ICancha>(`${this.resourceUrl}/${this.getCanchaIdentifier(cancha)}`, cancha, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICancha>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICancha[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCanchaIdentifier(cancha: Pick<ICancha, 'id'>): number {
    return cancha.id;
  }

  compareCancha(o1: Pick<ICancha, 'id'> | null, o2: Pick<ICancha, 'id'> | null): boolean {
    return o1 && o2 ? this.getCanchaIdentifier(o1) === this.getCanchaIdentifier(o2) : o1 === o2;
  }

  addCanchaToCollectionIfMissing<Type extends Pick<ICancha, 'id'>>(
    canchaCollection: Type[],
    ...canchasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const canchas: Type[] = canchasToCheck.filter(isPresent);
    if (canchas.length > 0) {
      const canchaCollectionIdentifiers = canchaCollection.map(canchaItem => this.getCanchaIdentifier(canchaItem));
      const canchasToAdd = canchas.filter(canchaItem => {
        const canchaIdentifier = this.getCanchaIdentifier(canchaItem);
        if (canchaCollectionIdentifiers.includes(canchaIdentifier)) {
          return false;
        }
        canchaCollectionIdentifiers.push(canchaIdentifier);
        return true;
      });
      return [...canchasToAdd, ...canchaCollection];
    }
    return canchaCollection;
  }
}
