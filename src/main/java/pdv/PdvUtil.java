package pdv;

import movimentacao.Movimentacao;


public class PdvUtil {
	
	

	public Movimentacao configureMovToPDV(Movimentacao mov){

		//Garantindo informações corretas na movimentação
		mov.setCategoria("Vendas");
		mov.setTipoOperacaoLancamento(Movimentacao.TIPO_OPERACAO_VENDA);
		mov.setTipo(Movimentacao.TIPO_RECEITA);

		return mov;
	}

}
