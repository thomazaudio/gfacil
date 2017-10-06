package lead;
import java.sql.Connection;
import java.sql.SQLException;
import org.springframework.stereotype.Repository;
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


	public void addActionByTel(String telefone, String action) {

		Connection con = DataBaseUtil.getConnection();

		try {
			//Os eventos sempre serão salvos em db_shared
			con.createStatement().execute("use db_shared");			
			con.createStatement().executeUpdate("update lead set actions = concat(actions,',','"+action+"')  where telefone='"+telefone+"'");		
		   
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
		}

	}

}
