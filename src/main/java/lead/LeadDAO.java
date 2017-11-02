package lead;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.stereotype.Repository;

import system.SystemUtil;
import database.DataBaseUtil;
import model.GenericDAO;

@Repository
public class LeadDAO extends GenericDAO<Lead>  {

	public LeadDAO() {
		super(Lead.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public Lead addOrUpdate(Lead item) {

		return super.addOrUpdate(item);
	}
	
	public void addIntMetric(String key, Integer value){
		
		Long idLead = SystemUtil.getCurrentUserDetails().getAccount().getIdLead();
		
		Connection con = DataBaseUtil.getConnection();

		try {
			//Os eventos sempre serão salvos em db_shared
			con.createStatement().execute("use db_shared");			
			int linhasAfetadas = con.createStatement().executeUpdate("update lead_metrics  set metrics = metrics +"+value+" where metrics_KEY='"+key+"' and Lead_id="+idLead);		
            if(linhasAfetadas==0){
            	con.createStatement().executeUpdate("insert into lead_metrics (Lead_id, metrics_KEY, metrics) values("+idLead+",'"+key+"', '"+value+"')");
            }  
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
		}
	}

	public  Long getIdLeadByTel(String tel){

		Connection con = DataBaseUtil.getConnection();

		Long idLead = null;

		ResultSet res = null;
		try {
			//Os eventos sempre serão salvos em db_shared
			con.createStatement().execute("use db_shared");			
			res   = con.createStatement().executeQuery("select id from lead where telefone= '"+tel+"'");		
			if(res.next()){
				idLead = res.getLong("id");
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				res.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return idLead ;

	}

	public  Lead getBasicInfoLeadById(long id){

		Connection con = DataBaseUtil.getConnection();

		Lead lead = null;

		ResultSet res = null;
		try {
			//Os eventos sempre serão salvos em db_shared
			con.createStatement().execute("use db_shared");			
			res   = con.createStatement().executeQuery("select nome, telefone from lead where id = "+id);		
			if(res.next()){
				lead = new Lead();
				lead.setNome(res.getString("nome"));
				lead.setTelefone(res.getString("telefone"));
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				res.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return lead;

	}



	public void addActionByTel(String telefone, String action) {

		Connection con = DataBaseUtil.getConnection();

		try {
			//Os eventos sempre serão salvos em db_shared
			con.createStatement().execute("use db_shared");			
			con.createStatement().executeUpdate("update lead set actions =  IFNULL (CONCAT( actions, ',' , '"+action+"' ),  '"+action+"')  where telefone='"+telefone+"'");		

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
		}

	}

}
