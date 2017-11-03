package produto;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lead.LeadService;
import model.GenericService;

@Service
public class  ProdutoService extends GenericService<Produto>   {

	@Autowired
	ProdutoDAO dao;
	
	@Autowired
	private LeadService leadService;
	
	
	@Override
	public Produto addOrUpdate(Produto item){
		
		
		super.addOrUpdate(item);
		return item;
			
	}
	
	
	public void deleteByIds(long[] ids){
		
		ProdutoDAO dao  = (ProdutoDAO) getDao();
		dao.deleteByIds(ids);
		
	}
	
	
	@Transactional
	public ArrayList<Produto> getProdutosMinEstoque(){
		
		return dao.getProdutosMinEstoque();
	}
	
	
	
	@Override
	public ArrayList<Produto> getLikeMap(String[] qs, int pagina, int max, String extra) {
		// TODO Auto-generated method stub
		return dao.getLikeMap(qs, pagina, max, extra);
	}
	

	
	
	
	
}
