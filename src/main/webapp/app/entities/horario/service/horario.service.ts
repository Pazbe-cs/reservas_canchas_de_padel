import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHorario, NewHorario } from '../horario.model';

export type PartialUpdateHorario = Partial<IHorario> & Pick<IHorario, 'id'>;

export type EntityResponseType = HttpResponse<IHorario>;
export type EntityArrayResponseType = HttpResponse<IHorario[]>;

@Injectable({ providedIn: 'root' })
export class HorarioService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/horarios');

  create(horario: NewHorario): Observable<EntityResponseType> {
    return this.http.post<IHorario>(this.resourceUrl, horario, { observe: 'response' });
  }

  update(horario: IHorario): Observable<EntityResponseType> {
    return this.http.put<IHorario>(`${this.resourceUrl}/${this.getHorarioIdentifier(horario)}`, horario, { observe: 'response' });
  }

  partialUpdate(horario: PartialUpdateHorario): Observable<EntityResponseType> {
    return this.http.patch<IHorario>(`${this.resourceUrl}/${this.getHorarioIdentifier(horario)}`, horario, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHorario>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHorario[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHorarioIdentifier(horario: Pick<IHorario, 'id'>): number {
    return horario.id;
  }

  compareHorario(o1: Pick<IHorario, 'id'> | null, o2: Pick<IHorario, 'id'> | null): boolean {
    return o1 && o2 ? this.getHorarioIdentifier(o1) === this.getHorarioIdentifier(o2) : o1 === o2;
  }

  addHorarioToCollectionIfMissing<Type extends Pick<IHorario, 'id'>>(
    horarioCollection: Type[],
    ...horariosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const horarios: Type[] = horariosToCheck.filter(isPresent);
    if (horarios.length > 0) {
      const horarioCollectionIdentifiers = horarioCollection.map(horarioItem => this.getHorarioIdentifier(horarioItem));
      const horariosToAdd = horarios.filter(horarioItem => {
        const horarioIdentifier = this.getHorarioIdentifier(horarioItem);
        if (horarioCollectionIdentifiers.includes(horarioIdentifier)) {
          return false;
        }
        horarioCollectionIdentifiers.push(horarioIdentifier);
        return true;
      });
      return [...horariosToAdd, ...horarioCollection];
    }
    return horarioCollection;
  }
}
