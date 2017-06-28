package movimentacao;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;
import model.GenericDAO;
import pedido.Pedido;
import util.DataUtil;

@Repository
public class MovimentacaoDAO extends GenericDAO<Movimentacao> {

	public MovimentacaoDAO() {
		super(Movimentacao.class);
		// TODO Auto-generated constructor stub
	}
	
	
	public Movimentacao deleteMov(Movimentacao mov,String modo) {

		mov.setDisable(1);
		List<Pedido> pedidos = mov.getPedidos();
		for(int i=0;i<pedidos.size();i++){

			pedidos.get(i).setDisable(1);

		}
		mov.setPedidos(pedidos);
		this.addOrUpdate(mov);

		//Deletar parcelas
		if(modo.equals("all")){
          
		  if(mov.getOriginalMov()!=null)
            deleteParcelas(mov.getOriginalMov().getId());
		  
		  else
			deleteParcelas(mov.getId()); 

		}


		return null;

	}
	
	
	public Movimentacao addParcelas(Movimentacao[] movs) {

		//salva a movimentação Original
		Movimentacao originalMov =  addOrUpdate(movs[0]);
		Movimentacao movAux = new Movimentacao();
		movAux.setId(originalMov.getId());

		for(int i=1;i<movs.length;i++){
			
			//Garante que as informações na parcela esteja correta
			movs[i].setPessoa(movs[0].getPessoa());

			//movs[i].setPedidos(null);
			movs[i].setOriginalMov(movAux);
			addOrUpdate(movs[i]);
		}

		return originalMov;
	}
	
	
	public void deleteByPdv(long idPdv){
		Query q  = this.getSessionFactory().getCurrentSession().createQuery("delete from Movimentacao where pdv.id=:idPdv");
		q.setLong("idPdv",idPdv);
		q.executeUpdate();
		
	}
	
	public Movimentacao getByPdv(long idPdv){
		
		return (Movimentacao) this.getSessionFactory().getCurrentSession().createQuery("from Movimentacao where pdv.id="+idPdv).uniqueResult();
	}
	
	@Override
	public Movimentacao addOrUpdate(Movimentacao item) {
		
		 if(item.getTipo()==0){
			 
			 new MovimentacaoException("O tipo da movimentação (Receita ou Despesa) deve ser definido");
		 } 
		
		if(item.getId()==0 && item.getData()==null)
			item.setData(DataUtil.getFormated(new Date()));
		
		for(int i=0;item.getPedidos()!=null && i<item.getPedidos().size();i++){
				
			    item.getPedidos().get(i).setDate(item.getData());
				item.getPedidos().get(i).setMovimentacao(item);
				
		}
		
		Date dataMovimentacao = item.getData();
		
		if(dataMovimentacao==null)
			dataMovimentacao = new Date();
		
		if(item.isBaixada()==true && item.getDataBaixa()==null)
			item.setDataBaixa(DataUtil.getFormated(dataMovimentacao));

		
		else if(!item.isBaixada()){
			item.setDataBaixa(null);
		}
		
		//Em caso de cadastro de movimentação fixa marcada como baixada
		if(item.getId()==0 && item.getModoRepeticao()!=0 && item.isBaixada()){
			
			item.setDataBaixa(null);
			item.setBaixada(false);//Retira data de baixa e isBaixada da movimentação fixa para evitar problemas
			
		}
		
		return super.addOrUpdate(item);
	}
	
	public void deleteParcelas(long idOriginalMov){
		
		Query q = this.getSessionFactory().getCurrentSession().createQuery("update Movimentacao set disable=1 where originalMov.id=:id");
		q.setLong("id",idOriginalMov);
		q.executeUpdate();
	}
	
	@SuppressWarnings("unchecked")
	public ArrayList<Movimentacao> getParcelas(long idOriginalMov){
		
		Query q = this.getSessionFactory().getCurrentSession().createQuery("from Movimentacao  where disable=0 and originalMov.id=:id ");
		q.setLong("id",idOriginalMov);
		return (ArrayList<Movimentacao>) q.list();
		
	}
	
	

}
