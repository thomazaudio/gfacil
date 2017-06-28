package produto;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import model.GenericService;

@Service
public class  ProdutoService extends GenericService<Produto>   {

	@Autowired
	ProdutoDAO dao;
	
	
	
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
