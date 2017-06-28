package movimentacao;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import model.GenericService;
import pedido.PedidoService;

@Service
public class MovimentacaoService extends GenericService<Movimentacao>{

	@Autowired
	private MovimentacaoDAO dao;
	
	@Autowired
	private PedidoService pedidoService;
	
	
	@Override
	public Movimentacao addOrUpdate(Movimentacao item) {
		
	
		
		return super.addOrUpdate(item);
	}
	


	@Transactional
	//Salva movimentações com parcelas
	//A movimentaçao movs[0] sempre será a originalMov, que servirá como referência pras demais parcelas
	//O método retorna a original mov
	public Movimentacao addParcelas(Movimentacao[] movs) {

		return dao.addParcelas(movs);
	}

	
	@Transactional
	public Movimentacao deleteMov(Movimentacao mov,String modo) {

		return dao.deleteMov(mov, modo);

	}

	@Transactional
	public ArrayList<Movimentacao> getParcelas(long idOriginalMov){

		return dao.getParcelas(idOriginalMov);
	}
	
	@Transactional
	public Movimentacao getByPdv(long idPdv){

		return dao.getByPdv(idPdv);
	}
	
	
	@Transactional
	public void deleteMovByPdv (Movimentacao mov){

		//Deletar Pedidos 
		pedidoService.deletePedidosByMovimentacao(mov.getId());
		
		//Deletar Movimentação
		long[] ids = {mov.getId()};
		this.deleteByIds(ids);
		
	}
	
	
	
	@Transactional
	public void deleteParcelas (long idOriginalMov){

		dao.deleteParcelas(idOriginalMov);

	}

}