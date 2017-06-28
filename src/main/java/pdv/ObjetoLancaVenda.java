package pdv;

import movimentacao.Movimentacao;

public class ObjetoLancaVenda {

	private Pdv pdv;
	private Movimentacao[] parcelas;
	
	public Movimentacao[] getParcelas() {
		return parcelas;
	}

	public void setParcelas(Movimentacao[] parcelas) {
		this.parcelas = parcelas;
	}

	

	public Pdv getPdv() {
		return pdv;
	}

	public void setPdv(Pdv pdv) {
		this.pdv = pdv;
	}
	
	
}
