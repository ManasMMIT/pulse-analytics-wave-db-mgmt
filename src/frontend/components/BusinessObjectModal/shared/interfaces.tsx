
interface Datum {
  [key: string]: any
}

export interface ModalAndModalButtonSharedProps {
  entityId?: string | null
  refetchQueries?: any[]
  afterMutationHook?: (datum: Datum) => void
}
