/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * Flash Cards API
 * API documentation for the Flash Cards application
 * OpenAPI spec version: 1.0
 */
import {
  useMutation,
  useQuery
} from '@tanstack/vue-query';
import type {
  DataTag,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationReturnType,
  UseQueryOptions,
  UseQueryReturnType
} from '@tanstack/vue-query';

import {
  computed,
  unref
} from 'vue';
import type {
  MaybeRef
} from 'vue';

import type {
  CreateSubjectDto,
  SubjectResponse,
  SubjectResponseWithCount,
  UpdateSubjectDto
} from '../flashCardsAPI.schemas';

import subjectControllerCreateMutator from '../../fetchWithAuth';
import subjectControllerFindAllMutator from '../../fetchWithAuth';
import subjectControllerFindOneMutator from '../../fetchWithAuth';
import subjectControllerUpdateMutator from '../../fetchWithAuth';
import subjectControllerRemoveMutator from '../../fetchWithAuth';




/**
 * @summary Create a new subject
 */
export const subjectControllerCreate = (
    createSubjectDto: MaybeRef<CreateSubjectDto>,
 signal?: AbortSignal
) => {
      createSubjectDto = unref(createSubjectDto);
      
      return subjectControllerCreateMutator<SubjectResponse>(
      {url: `/subject`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createSubjectDto, signal
    },
      );
    }
  


export const getSubjectControllerCreateMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof subjectControllerCreate>>, TError,{data: CreateSubjectDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof subjectControllerCreate>>, TError,{data: CreateSubjectDto}, TContext> => {

const mutationKey = ['subjectControllerCreate'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof subjectControllerCreate>>, {data: CreateSubjectDto}> = (props) => {
          const {data} = props ?? {};

          return  subjectControllerCreate(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type SubjectControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof subjectControllerCreate>>>
    export type SubjectControllerCreateMutationBody = CreateSubjectDto
    export type SubjectControllerCreateMutationError = void

    /**
 * @summary Create a new subject
 */
export const useSubjectControllerCreate = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof subjectControllerCreate>>, TError,{data: CreateSubjectDto}, TContext>, }
 , queryClient?: QueryClient): UseMutationReturnType<
        Awaited<ReturnType<typeof subjectControllerCreate>>,
        TError,
        {data: CreateSubjectDto},
        TContext
      > => {

      const mutationOptions = getSubjectControllerCreateMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    /**
 * @summary Get all subjects for the authenticated user
 */
export const subjectControllerFindAll = (
    
 signal?: AbortSignal
) => {
      
      
      return subjectControllerFindAllMutator<SubjectResponseWithCount[]>(
      {url: `/subject`, method: 'GET', signal
    },
      );
    }
  

export const getSubjectControllerFindAllQueryKey = () => {
    return ['subject'] as const;
    }

    
export const getSubjectControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof subjectControllerFindAll>>, TError = void>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subjectControllerFindAll>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  getSubjectControllerFindAllQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof subjectControllerFindAll>>> = ({ signal }) => subjectControllerFindAll(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof subjectControllerFindAll>>, TError, TData> 
}

export type SubjectControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof subjectControllerFindAll>>>
export type SubjectControllerFindAllQueryError = void


/**
 * @summary Get all subjects for the authenticated user
 */

export function useSubjectControllerFindAll<TData = Awaited<ReturnType<typeof subjectControllerFindAll>>, TError = void>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subjectControllerFindAll>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ): UseQueryReturnType<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSubjectControllerFindAllQueryOptions(options)

  const query = useQuery(queryOptions , queryClient) as UseQueryReturnType<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = unref(queryOptions).queryKey as DataTag<QueryKey, TData, TError>;

  return query;
}



/**
 * @summary Get a specific subject by ID
 */
export const subjectControllerFindOne = (
    id: MaybeRef<string>,
 signal?: AbortSignal
) => {
      id = unref(id);
      
      return subjectControllerFindOneMutator<SubjectResponseWithCount>(
      {url: `/subject/${id}`, method: 'GET', signal
    },
      );
    }
  

export const getSubjectControllerFindOneQueryKey = (id: MaybeRef<string>,) => {
    return ['subject',id] as const;
    }

    
export const getSubjectControllerFindOneQueryOptions = <TData = Awaited<ReturnType<typeof subjectControllerFindOne>>, TError = void>(id: MaybeRef<string>, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subjectControllerFindOne>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  getSubjectControllerFindOneQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof subjectControllerFindOne>>> = ({ signal }) => subjectControllerFindOne(id, signal);

      

      

   return  { queryKey, queryFn, enabled: computed(() => !!(unref(id))), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof subjectControllerFindOne>>, TError, TData> 
}

export type SubjectControllerFindOneQueryResult = NonNullable<Awaited<ReturnType<typeof subjectControllerFindOne>>>
export type SubjectControllerFindOneQueryError = void


/**
 * @summary Get a specific subject by ID
 */

export function useSubjectControllerFindOne<TData = Awaited<ReturnType<typeof subjectControllerFindOne>>, TError = void>(
 id: MaybeRef<string>, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subjectControllerFindOne>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ): UseQueryReturnType<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSubjectControllerFindOneQueryOptions(id,options)

  const query = useQuery(queryOptions , queryClient) as UseQueryReturnType<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = unref(queryOptions).queryKey as DataTag<QueryKey, TData, TError>;

  return query;
}



/**
 * @summary Update a specific subject by ID
 */
export const subjectControllerUpdate = (
    id: MaybeRef<string>,
    updateSubjectDto: MaybeRef<UpdateSubjectDto>,
 ) => {
      id = unref(id);
updateSubjectDto = unref(updateSubjectDto);
      
      return subjectControllerUpdateMutator<SubjectResponse>(
      {url: `/subject/${id}`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateSubjectDto
    },
      );
    }
  


export const getSubjectControllerUpdateMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof subjectControllerUpdate>>, TError,{id: string;data: UpdateSubjectDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof subjectControllerUpdate>>, TError,{id: string;data: UpdateSubjectDto}, TContext> => {

const mutationKey = ['subjectControllerUpdate'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof subjectControllerUpdate>>, {id: string;data: UpdateSubjectDto}> = (props) => {
          const {id,data} = props ?? {};

          return  subjectControllerUpdate(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type SubjectControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof subjectControllerUpdate>>>
    export type SubjectControllerUpdateMutationBody = UpdateSubjectDto
    export type SubjectControllerUpdateMutationError = void

    /**
 * @summary Update a specific subject by ID
 */
export const useSubjectControllerUpdate = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof subjectControllerUpdate>>, TError,{id: string;data: UpdateSubjectDto}, TContext>, }
 , queryClient?: QueryClient): UseMutationReturnType<
        Awaited<ReturnType<typeof subjectControllerUpdate>>,
        TError,
        {id: string;data: UpdateSubjectDto},
        TContext
      > => {

      const mutationOptions = getSubjectControllerUpdateMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    /**
 * @summary Delete a specific subject by ID
 */
export const subjectControllerRemove = (
    id: MaybeRef<string>,
 ) => {
      id = unref(id);
      
      return subjectControllerRemoveMutator<SubjectResponse>(
      {url: `/subject/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getSubjectControllerRemoveMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof subjectControllerRemove>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof subjectControllerRemove>>, TError,{id: string}, TContext> => {

const mutationKey = ['subjectControllerRemove'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof subjectControllerRemove>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  subjectControllerRemove(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type SubjectControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof subjectControllerRemove>>>
    
    export type SubjectControllerRemoveMutationError = void

    /**
 * @summary Delete a specific subject by ID
 */
export const useSubjectControllerRemove = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof subjectControllerRemove>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationReturnType<
        Awaited<ReturnType<typeof subjectControllerRemove>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getSubjectControllerRemoveMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    