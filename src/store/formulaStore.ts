import { create } from 'zustand';
import Formula from '@/app/interfaces/Formula.interface';
import Answer from '@/app/interfaces/Answer.interface';

interface FormulaState {
  formulas: Formula[];
  currentFormula: Formula | null;
  answers: Answer[];
  setFormulas: (formulas: Formula[]) => void;
  setCurrentFormula: (formula: Formula | null) => void;
  addFormula: (formula: Formula) => void;
  updateFormula: (id: string, formula: Formula) => void;
  addAnswer: (formulaId: string, answer: Answer) => void;
  getAnswersByFormulaId: (formulaId: string) => Answer[];
}

const useFormulaStore = create<FormulaState>((set, get) => ({
  formulas: [],
  currentFormula: null,
  answers: [],
  
  setFormulas: (formulas) => set({ formulas }),
  
  setCurrentFormula: (formula) => set({ currentFormula: formula }),
  
  addFormula: (formula) => set((state) => ({ 
    formulas: [...state.formulas, formula] 
  })),
  
  updateFormula: (_id, updatedFormula) => set((state) => ({
    formulas: state.formulas.map(formula => 
      formula._id === _id ? updatedFormula : formula
    )
  })),
  
  addAnswer: (formulaId, answer) => set((state) => {
    const updatedFormulas = state.formulas.map(formula => {
      if (formula._id === formulaId) {
        return {
          ...formula,
          answers: [...(formula.answers || []), answer]
        };
      }
      return formula;
    });
    
    return {
      formulas: updatedFormulas,
      answers: [...state.answers, answer]
    };
  }),
  
  getAnswersByFormulaId: (formulaId) => {
    const formula = get().formulas.find(f => f._id === formulaId);
    return formula?.answers || [];
  }
}));

export default useFormulaStore;