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
}

export const GlobalStateContext = createContext<GlobalStateContextProps|undefined>(undefined)

export const GlobalStateProvider: FC<PropsWithChildren> = ({ children }) => {

    // const { mutate } = useSWRConfig()
    const [modals, setModals] = useState<ModalState>({
        "create_assessment" : {
            open: false,
        }
    })

    const openModal = (modal_key:string, open_state :boolean)=> {
        setModals({...modals, [modal_key]: { open: open_state } })
    }


    return (
        <GlobalStateContext.Provider value={{ modals, setModals,openModal }}>
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
  