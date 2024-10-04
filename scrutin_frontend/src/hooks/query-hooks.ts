import { useFrappeGetDocList } from "frappe-react-sdk";

export const useAssessmentsListQuery = () =>{
    return useFrappeGetDocList<any>(
        'Scrutin Assessment',
        {
          fields: ['assessment_name', 'company', 'language'],
          orderBy: {
            field: 'creation',
            order: 'desc',
          },
          asDict: true,
        },
      );
}


export const useCompanyListQuery = () =>{
    return useFrappeGetDocList<any>(
        'Company',
        {
          fields: ['*'],
          orderBy: {
            field: 'creation',
            order: 'desc',
          },
          asDict: true,
        },
      );
}

export const useLanguageListQuery = () =>{
    return useFrappeGetDocList<any>(
        'Language',
        {
          fields: ['name'],
          orderBy: {
            field: 'creation',
            order: 'desc',
          },
          asDict: true,
        },
      );
}