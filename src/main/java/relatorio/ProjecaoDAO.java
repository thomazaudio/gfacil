package relatorio;
import java.util.ArrayList;
import java.util.Map;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import database.DataBaseUtil;
import model.GenericDAO;
import system.SystemUtil;

@Repository
public class ProjecaoDAO extends GenericDAO<Projecao> {

	public ProjecaoDAO() {
		super(Projecao.class);
		// TODO Auto-generated constructor stub
	}
	
   @SuppressWarnings("unchecked")
   public ArrayList<Map<String,Object>> getProjecoes (String objeto, ArrayList<String> qs,String extra,String columns, String groupBy, int max){
	   
	   
	  //Caso seja um objeto pertencente a Crud, é inserido a query para filtragem da Filial definida 
	  if(DataBaseUtil.isCrudEntity(SystemUtil.getClass(objeto))){
		  
		  String queryFilial = DataBaseUtil.getQueryFilial().replaceAll("and","");
		  
		  if(queryFilial.length()>0)
		     qs.add(queryFilial);
	  }
	  else{
		  System.out.println("A classe "+objeto+" NÃO é crudEntity");
		  
	  }
	   
	   String query = "select "+columns+" from "+objeto+" where ";
	   String condicao ="";
	   int i=0;
	   for(String q :qs){

			if(q.length()==0 || q==null)
				continue;

			condicao+=" "+q+" ";
			i++;

			if(i<qs.size())
				condicao+=" and ";

		}
	   
	    query+=condicao;
	    
	   

	    if(groupBy!=null && !groupBy.equals("null") && groupBy.length()>0)
	      query+=" group by "+groupBy;
	    
	    
        if(extra!=null && extra.length()>0){
	    	
	    	query+=" "+extra;
	    }
	    
        
        System.out.println("Query a ser executada em getProjecoes: "+query);
	    
	    Query q = this.getSessionFactory().getCurrentSession().createQuery(query);
	    q.setMaxResults(max);
	    return (ArrayList<Map<String,Object>>) q.list();
	   
	}
   
   @SuppressWarnings("unchecked")
   public ArrayList<Map<String,Object>> executeQuery(String query){
	   
	   
	   
	    //Injeção da query de filial
	   if(!query.contains("ignoreFilial"))
	    query = DataBaseUtil.injectQueryFilial(query, null);
	   
	   query= query.replace("ignoreFilial","");
	   
	   
	    Query q = this.getSessionFactory().getCurrentSession().createQuery(query);
	    return (ArrayList<Map<String,Object>>) q.list();
	   
	}
	
	
}
