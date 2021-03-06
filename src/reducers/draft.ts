import { DraftState, INITIAL_DRAFT_STATE } from '../types/app';
import { DraftAction } from '../actions/app';

export function draftReducer(draft = INITIAL_DRAFT_STATE, action: DraftAction): DraftState {
    switch (action.type) {
        case 'newItemInput':
            return {
                ...draft, 
                newItemNames: {
                    ...draft.newItemNames, 
                    [action.columnId]: action.newItemName
                }
            };

        case 'newColumnInput':
            return {...draft, newColumnName: action.newColumnName};

        case 'commandQueued':
            switch(action.command.type) {
                case 'addItem':
                    return {
                        ...draft, 
                        newItemNames: {
                            ...draft.newItemNames, 
                            [action.command.item.columnId]: ''
                        }
                    };
                case 'addColumn':
                    return {...draft, newColumnName: ''};
                default:
                    return draft;
            }

        default:
            return draft;
    }
}
