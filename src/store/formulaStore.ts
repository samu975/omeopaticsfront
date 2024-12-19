import Formula from "@/app/interfaces/Formula.interface"
import { create } from "zustand"

interface FormulaState {
  formula: Formula
  setFormula: (formula: Formula) => void
}

const useFormulaStore = create<FormulaState>((set) => ({
  formula: {
    name: '',
    description: '',
    medicines: []
  },
  setFormula: (formula: Formula) => set({ formula })
}))

export default useFormulaStore