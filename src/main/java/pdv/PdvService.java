package pdv;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cliente.Cliente;
import cliente.ClienteService;
import logisticareversa.LogisticaReversa;
import logisticareversa.LogisticaReversaService;
import model.GenericService;
import movimentacao.Movimentacao;
import movimentacao.MovimentacaoService;
import pedido.Pedido;
import system.SystemUtil;

@Service
public class PdvService extends GenericService<Pdv>{
	
	private PdvUtil pdvUtil = new PdvUtil();

	@Autowired
	private MovimentacaoService movService;

	@Autowired
	private LogisticaReversaService lrService;

	@Autowired
	private PdvDAO pdvFichaDAO;
	
	@Autowired
	private ClienteService clienteService;



	@Transactional
	public Pdv getPdvById(long id){

		return super.getById(id);
	}


	@Override
	@Transactional
	public Pdv addOrUpdate(Pdv item) {
         
		Date dataVenda = item.getData();

		//Se a data da venda for null, é setada como a data atual do sistema
		if(dataVenda==null)
			dataVenda = new Date();
		
	    if(item.getParcelas()!=null){
			//Garante as inforações básicas corretas para todas as parcelas
			for(int i=0;i<item.getParcelas().length;i++){
				
				item.getParcelas()[i] = pdvUtil.configureMovToPDV(item.getParcelas()[i]);
				
			}
		}
		
		//Salva as parcelas da movimentação
		Movimentacao originalMov =  movService.addParcelas(item.getParcelas());
		
		//Seta a movimentação original no PDV
        item.setMovimentacao(originalMov);

		//Lr do PDV
		LogisticaReversa  lr = item.getLr();

		if(lr!=null && (lr.getId()!=0 || lr.getQuantidade()>0)){
			
			lr.setPessoa(item.getMovimentacao().getPessoa());
			lr.setTipo(LogisticaReversa.TIPO_SAIDA);//(Empréstimo)
			lrService.addOrUpdate(lr);
			item.setLr(lr);

		}
		
		long idFilial = item.getIdFilial();
		
		if(idFilial==0)
			idFilial = SystemUtil.getCurrentUserDetails().getAccount().getCurrentFilialId();

		List<Pedido> pds = item.getMovimentacao().getPedidos();

		for(Pedido p : pds){

			//Garante relação entre movimentação e pedido
			p.setMovimentacao(item.getMovimentacao());

			//definição da data do pedido de acordo com a data da venda
			p.setDate(dataVenda);
			
			p.setIdFilial(idFilial);

		}
		
		//Atualiza os produtos sugeridos para o cliente
	    clienteService.atualizarProdutosSugeridos(item.getMovimentacao().getPessoa().getId(), new Cliente().montaSugestoesProdutos(pds));

		super.addOrUpdate(item);

		return item;
	}

	@Transactional 
	public void deleteByMovimentacao(long idMov){

		pdvFichaDAO.deleteByMovimentacao(idMov);
	}

}
