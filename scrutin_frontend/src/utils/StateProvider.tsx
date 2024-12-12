/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { useRetrieveNextQuestion } from '@/hooks/post-hooks';
import { GlobalStateProviderQuestion } from '@/types/Interface';
import { Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from 'react'
import { createContext } from 'react'
interface Modal {
    open: boolean;
}
interface ModalState {
    [modal_key: string]: Modal;
}
interface GlobalStateContextProps {
    modals : ModalState;
    setModals: Dispatch<SetStateAction<ModalState>>;
    openModal : (modal_key:string, open_state :boolean) => void;
    triggerReload: boolean;
    setTriggerReload: Dispatch<SetStateAction<boolean>>;
    question : GlobalStateProviderQuestion
    updateCurrentQuestion : (candidate_id:string|undefined) => void;
    loading: boolean
    error: any | null
    selectedOption: string | string[] | null;
    setSelectedOption: Dispatch<SetStateAction<string | string[] | null>>;
    
}

export const GlobalStateContext = createContext<GlobalStateContextProps|undefined>(undefined)

export const GlobalStateProvider: FC<PropsWithChildren> = ({ children }) => {



    const next_question_api = useRetrieveNextQuestion();
    const question = next_question_api.result
    const loading = next_question_api.loading
    const error = next_question_api.error
    const [selectedOption, setSelectedOption] = useState<string | string[] | null>(null);

    // const { candidate_id } = useParams();

    const updateCurrentQuestion = async (candidate_id:string|null=null) => {
        if(candidate_id){
            next_question_api.call({
                candidate_id:candidate_id
            })
        }
    }

    // const { mutate } = useSWRConfig()
    const [modals, setModals] = useState<ModalState>({
        "create_assessment" : { open: false},
        "set_test_weights"  : { open: false},
        "feed_back"         : { open: false},
        "add_team_member"   : { open: false},
        "interpret_results" : { open: false},
        "anti_cheating_measures" : { open: false},
        "choose_scoring_method" : { open: false},
        "communication_skills_assessment" : { open: false},
        "review_answer" : { open: false},
        "test_resutls" : { open: false},


    })

    const [triggerReload, setTriggerReload] = useState(false);

    const openModal = (modal_key:string, open_state :boolean)=> {
        setModals({...modals, [modal_key]: { open: open_state } })
    }


    return (
        <GlobalStateContext.Provider
        value={{
            modals,
            setModals,
            openModal,
            triggerReload,
            setTriggerReload,
            question,
            updateCurrentQuestion,
            loading,
            error,
            selectedOption,
            setSelectedOption,
        }}
    >
        {children}
    </GlobalStateContext.Provider>
    )
}


export const useGlobalState = (): GlobalStateContextProps => {
    const context = useContext(GlobalStateContext);
    if (context === undefined) {
      throw new Error('useGlobalState must be used within a GlobalStateProvider');
    }
    return context;
  };
  