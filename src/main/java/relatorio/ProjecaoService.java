package relatorio;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import model.GenericService;

@Service
public class ProjecaoService extends GenericService<Projecao> {
	
  @Autowired	
  private ProjecaoDAO projDAO;
  
  @Transactional
  public ArrayList<Map<String,Object>> executeQuery (String query){
		
	  return projDAO.executeQuery(query);
	  
 }
	
  @Transactional
  public ArrayList<Map<String,Object>> getProjecoes (String objeto, ArrayList<String> qs,String extra,String columns,String groupBy, int max){
		
	  return projDAO.getProjecoes(objeto, qs,extra, columns,groupBy,max);
	  
 }
}
