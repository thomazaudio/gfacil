package entradamercadoria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import model.GenericDAO;
import movimentacao.Movimentacao;
import movimentacao.MovimentacaoDAO;
import pedido.Pedido;
import pedido.PedidoDAO;

@Repository
public class EntradaMercadoriaDAO extends GenericDAO<EntradaMercadoria> {

	@Autowired 
	private MovimentacaoDAO movDAO;
	
	@Autowired 
	private PedidoDAO pedidoDAO;
	
	public EntradaMercadoriaDAO() {
		super(EntradaMercadoria.class);
		// TODO Auto-generated constructor stub
	}
	
	
	public void deletarEM(EntradaMercadoria em){
		
		em.setDisable(1);
		
		
		//Deleta todos os pedidos
		for(Pedido p:em.getMovimentacao().getPedidos()){
			p.setDisable(1);
			//pedidoDAO.addOrUpdate(p);
			
		}
		
		em.getMovimentacao().setDisable(1);
		//movDAO.addOrUpdate(em.getMovimentacao());
		
		
		super.addOrUpdate(em);
			
	}
	
	
	@Override
	public EntradaMercadoria addOrUpdate(EntradaMercadoria em) {
		
		
		//Garante que todos os pedidos sejao do tipo entrada
		if(em.getMovimentacao().getPedidos()!=null){
			for(Pedido p: em.getMovimentacao().getPedidos()){
				p.setTipoEntrada(1);
				pedidoDAO.addOrUpdate(p);
			}
		}
		
		
		//Garante que a movimentação seja uma despesa
		em.getMovimentacao().setTipo(Movimentacao.TIPO_DESPESA);
		
		//Tipo de operação para o lançamento da movimentação
		em.getMovimentacao().setTipoOperacaoLancamento(Movimentacao.TIPO_OPERACAO_ENTRADA_ESTOQUE);
		
		movDAO.addOrUpdate(em.getMovimentacao());
		
		
		
		
		return super.addOrUpdate(em);
	}
   
}
