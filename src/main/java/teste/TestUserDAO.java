package teste;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.springframework.stereotype.Repository;

import database.DataBaseUtil;
import model.GenericDAO;
import system.SystemUtil;
import usersystem.UserSystem;

@Repository
public class TestUserDAO extends GenericDAO<TestUser> {

	public TestUserDAO() {
		super(TestUser.class);
		// TODO Auto-generated constructor stub
	}
	
	
	public TestUser addTeste(TestUser test){
		
		Connection con = DataBaseUtil.getConnection();

		PreparedStatement stm =null;
		
		UserSystem user = SystemUtil.getCurrentUserDetails().getAccount();
		
		String query = "insert into testuser(comentario, usuario, id_definition, tempoGasto, disable, status, valorPago, erroSistema, nivelDificuldadeFromUser) values(?,?,?,?,?,?,?, ?, ?)";

		try {
            //Os eventos sempre serão salvos em db_shared
			con.createStatement().execute("use db_shared");			
			stm = con.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
			stm.setString(1,test.getComentario());
			stm.setString(2, user.getLogin());
			stm.setLong(3, test.getDefinition().getId());
			stm.setLong(4, test.getTempoGasto());
			stm.setInt(5,0);
			stm.setInt(6,0);
			stm.setDouble(7, test.getDefinition().getPrecoTeste());
			stm.setInt(8, test.getErroSistema());
			stm.setInt(9, test.getNivelDificuldadeFromUser());
			stm.executeUpdate();
			
			ResultSet rs = stm.getGeneratedKeys();

			if (rs.next()) {
			    long id = rs.getLong(1);
			    test.setId(id);
			    System.out.println("Inserted ID -" + id); // display inserted record
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
				
		return test;
		
	}
	
	public TestDefinition getProxText(){
		
		TestDefinition testDefinition = null;
		
		Connection con = DataBaseUtil.getConnection();

		PreparedStatement stm =null;
		
		UserSystem user = SystemUtil.getCurrentUserDetails().getAccount();
		
		String query = "select * from testdefinition  where id not in (select u.id_definition from testuser as u where u.usuario=?) order by id asc";

		try {
            //Os eventos sempre serão salvos em db_shared
			con.createStatement().execute("use db_shared");			
			stm = con.prepareStatement(query);
			stm.setString(1,user.getLogin());
			
			ResultSet res = stm.executeQuery();
			
			if(res.next()){
				
				testDefinition = new TestDefinition();
				testDefinition.setId(res.getLong("id"));
				testDefinition.setTitulo(res.getString("titulo"));
				testDefinition.setDescricao(res.getString("descricao"));
				testDefinition.setQueryVerification(res.getString("queryVerification"));
				testDefinition.setPrecoTeste(res.getDouble("precoTeste"));
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
		
		return testDefinition;
		
	}
	
	
public Long getTotalTestsForUser(){
		
		long totalTests = 0;
		
		Connection con = DataBaseUtil.getConnection();

		PreparedStatement stm =null;
		
		UserSystem user = SystemUtil.getCurrentUserDetails().getAccount();
		
		String query = "select count(*) from testuser where disable=0 and  usuario=?";

		try {
            //Os eventos sempre serão salvos em db_shared
			con.createStatement().execute("use db_shared");			
			stm = con.prepareStatement(query);
			stm.setString(1,user.getLogin());
			
			ResultSet res = stm.executeQuery();
			
			
			if(res.next()){
				
				totalTests = res.getLong("count(*)");
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
		
		return totalTests;
		
	}


public Double getSaldoForUser(){
	
	double saldo = 0;
	
	Connection con = DataBaseUtil.getConnection();

	PreparedStatement stm =null;
	
	UserSystem user = SystemUtil.getCurrentUserDetails().getAccount();
	
	String query = "select sum(valorPago) from testuser where disable=0 and pago=0 and  usuario=?";

	try {
        //Os eventos sempre serão salvos em db_shared
		con.createStatement().execute("use db_shared");			
		stm = con.prepareStatement(query);
		stm.setString(1,user.getLogin());
		
		ResultSet res = stm.executeQuery();
		
		
		if(res.next()){
			
			saldo = res.getDouble("sum(valorPago)");
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
	
	return saldo;
	
}

}
