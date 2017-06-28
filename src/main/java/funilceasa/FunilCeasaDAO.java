package funilceasa;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

import org.springframework.stereotype.Repository;

import util.DataUtil;
import database.DataBaseUtil;


@Repository
public class FunilCeasaDAO  {

	
	public FunilCeasaDAO() throws SQLException{
		
	}
	
	
	public void setDataUltimoAcesso(String login){
		
		PreparedStatement stm =null;
		
		try {
			
			stm = getPreparedStatement("update funilceasa set dataUltimoAcesso=? where login=?");
			System.out.println("Data setada no funilceasa");
			System.out.println(DataUtil.getIsoFormat(new Date()));
			stm.setString(1,DataUtil.getIsoFormat(new Date()));
			stm.setString(2,login);
			stm.executeUpdate();

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
	
	private PreparedStatement getPreparedStatement(String query){
		
		PreparedStatement stm = null;
		try {
			DataBaseUtil.getConnection().createStatement().execute("use db_shared");
			 stm = DataBaseUtil.getConnection().prepareStatement(query);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return stm;
	}
	
	public FunilCeasa getUserByPhone(String tel){
		
		
		String sql = "select * from funilceasa where telefone=?";
		PreparedStatement stm = null;
		FunilCeasa funil = null;
		
		try {
			stm = getPreparedStatement(sql);
			stm.setString(1,tel);
			ResultSet res  = stm.executeQuery();
			
			if(res.next()){
				
				funil = new FunilCeasa();
				funil.setNome(res.getString("nome"));
				funil.setLogin(res.getString("login"));
				funil.setInteressouPrimeiroContato(res.getInt("interessouPrimeiroContato"));
				funil.setEmail(res.getString("email"));
				funil.setTelefone(res.getString("telefone"));
				funil.setProdutos(res.getString("produtos"));
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
		
		return funil;
		
	}
	public boolean add(FunilCeasa user){
		
		String sql = "insert into funilceasa(nome,telefone,email, produtos, interessouPrimeiroContato, login,formaContato,endereco) values(?,?,?,?,?,?,?,?)";
		PreparedStatement stm = null;
		
		try {
			DataBaseUtil.getConnection().createStatement().execute("use db_shared");
			DataBaseUtil.getConnection().createStatement().execute("delete from funilceasa where telefone='"+user.getTelefone()+"'");
			stm = DataBaseUtil.getConnection().prepareStatement(sql);
			stm.setString(1,user.getNome());
			stm.setString(2,user.getTelefone());
			stm.setString(3,user.getEmail());
			stm.setString(4,user.getProdutos());
			stm.setInt(5,user.getInteressouPrimeiroContato());
			stm.setString(6,user.getLogin());
			stm.setString(7,user.getFormaContato());
			stm.setString(8,user.getEndereco());

			return stm.execute();
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
		
		
        return false;
      
	}
   
}
