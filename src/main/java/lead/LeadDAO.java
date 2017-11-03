package lead;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;

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
	
	public void addIntMetric(String key, Long value, boolean increment){
		
		Long idLead = SystemUtil.getCurrentUserDetails().getAccount().getIdLead();
		
		Connection con = DataBaseUtil.getConnection();
		Statement stm  = null;
		
		String updateValue = value+"";
		if(increment==true){
			updateValue = "metrics +"+value;
		}
		
		try {
			//Os eventos sempre serão salvos em db_shared
			stm = con.createStatement();		
			stm.execute("use db_shared");		
			int linhasAfetadas =stm.executeUpdate("update lead_metrics  set metrics="+updateValue+" where metrics_KEY='"+key+"' and Lead_id="+idLead);		
            if(linhasAfetadas==0){
            	con.createStatement().executeUpdate("insert into lead_metrics (Lead_id, metrics_KEY, metrics) values("+idLead+",'"+key+"', '"+value+"')");
            }  
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			
			try {
				stm.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	public  Long getIdLeadByTel(String tel){

		Connection con = DataBaseUtil.getConnection();

		Long idLead = null;

		ResultSet res = null;
		Statement stm  = null;
		try {
			stm =con. createStatement();
			//Os eventos sempre serão salvos em db_shared
			stm.execute("use db_shared");			
			res   = stm.executeQuery("select id from lead where telefone= '"+tel+"'");		
			if(res.next()){
				idLead = res.getLong("id");
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				res.close();
				stm.close();
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
		Statement stm  = null;
		try {
			stm = con.createStatement();
			//Os eventos sempre serão salvos em db_shared
			stm.execute("use db_shared");			
			res = stm.executeQuery("select nome, telefone from lead where id = "+id);		
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
				stm.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return lead;

	}
	
	public void setDataUltimoParam(String param, Long data) {

		Long idLead = SystemUtil.getCurrentUserDetails().getAccount().getIdLead();
		Connection con = DataBaseUtil.getConnection();
		Statement stm  = null;
		System.out.println("id do lead: "+idLead);
		try {
			//Os eventos sempre serão salvos em db_shared
			stm = con.createStatement();
			stm.execute("use db_shared");			
			stm.executeUpdate("update lead set "+param+"="+data+"  where id="+idLead);		

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				stm.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

	}

	public void addActionByTel(String telefone, String action) {

		Connection con = DataBaseUtil.getConnection();
		Statement stm  = null;
		try {
			stm = con.createStatement();
			//Os eventos sempre serão salvos em db_shared
			stm.execute("use db_shared");			
			stm.executeUpdate("update lead set actions =  IFNULL (CONCAT( actions, ',' , '"+action+"' ),  '"+action+"')  where telefone='"+telefone+"'");		

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				stm.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

	}

}
