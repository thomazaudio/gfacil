package database;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;
import javax.sql.DataSource;
import org.hibernate.cfg.Configuration;
import org.hibernate.cfg.Environment;
import org.hibernate.tool.hbm2ddl.SchemaExport;
import org.hibernate.tool.hbm2ddl.SchemaUpdate;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;
import com.mchange.v2.c3p0.C3P0Registry;
import com.mchange.v2.c3p0.ComboPooledDataSource;
import com.mchange.v2.c3p0.PooledDataSource;

import crud.CrudClass;
import security.AccountUserDetails;
import system.SystemUtil;
import usersystem.UserSystem;
import util.SpringUtil;
public class DataBaseUtil {
	
  private static String dbURL;
	
	public static String DB_PREFIX = "db_";
	
	
	//Injeta a query de filial em query completo. ex: "from Produto where nome like '%Teste%'"
	public static String injectQueryFilial(String query, String queryFilial){
		
		
		Object objectInQuery = getObjectFromQuery(query);
		
		if(!isCrudEntity(objectInQuery.getClass()))
			return query;
		
		
		if(queryFilial==null)
			queryFilial = getQueryFilial();
		
		queryFilial = queryFilial.replace("and","");
		
		
		//Caso não tenha filial definida
		if(queryFilial.length()==0)
			return query;
		
		
		String sufix =""+queryFilial+"";
		
		int posBase = 0;
		
		String nomeObjeto = objectInQuery.getClass().getSimpleName();
		
		if(query.toLowerCase().contains("where")){
			
			sufix+=" and";
			posBase  = query.toLowerCase().indexOf("where")+"where".length();
			
		}else{
			
			sufix = " where"+sufix;
			posBase = query.indexOf(nomeObjeto)+nomeObjeto.length();
		}
		
	
		
		String novaQuery = query.substring(0,posBase)+sufix+query.substring(posBase);
		
		
		novaQuery = novaQuery.trim();
		
		
		return novaQuery;
		
		
		
	}
	
	
	public static String getQueryFilial(){

		AccountUserDetails user = SystemUtil.getCurrentUserDetails();

		String query ="";
		
		long idFilial  = 0;
		
		if(user!=null && user.getAccount()!=null){
			
			idFilial = user.getAccount().getCurrentFilialId();
		}

		//TODO Query para filial relacionada, se houver
		if(idFilial!=0)
			query=" and (idFilial = "+idFilial+" or idFilial=0  or allFilials=1)";

		return query;

	}
	
	
	
	   //Verifica se um objeto e CrudClass
		public static  boolean isCrudEntity(Class classe){

			return CrudClass.class.isAssignableFrom(classe);
		}

		
		//Extrai o objeto definido em um query (Ex: "Select id from Produto where...")
	    public static <E> Object getObjectFromQuery(String query){
	    	
	    	
	    	int first = query.lastIndexOf("from ");
	    	
	    	String texto = query.substring(first,query.length());
	    	
	    	texto = texto.replace("from ","");
	    	
	    	if(texto.indexOf(" ")!=-1)
	    	texto = texto.substring(0,texto.indexOf(" "));
	    	
	    	texto = texto.toLowerCase()+"."+texto;
	    	
	    	
	    	try{
	    		
	    		return Class.forName(texto).newInstance();
	    	}catch(Exception e){
	    		
	    		
	    		return null;
	    	}
	    	
				
			
	    	
	    }
	
	
	public static String getDbConnectionString(){
		
		
		
		System.out.println("URL que está em dbURL: "+dbURL);
		
		if(dbURL==null){
			dbURL = System.getProperty("JDBC_CONNECTION_STRING");
			
			if(dbURL==null){
				dbURL = "jdbc:mysql://localhost/";
				
				
			}
			
		}
		return dbURL;
	}
	
	public static    Connection connection = null;
	
    public static Connection getConnection(){
    	
    	try {
			if(connection==null || connection.isClosed())
				try {
					connection = 	DriverManager.getConnection(getDbConnectionString(),"root", "leghacy123");
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	return connection;
    }

	public static Connection getConnectionByTenant(String id){
		
		PooledDataSource dataSource = C3P0Registry.pooledDataSourceByName(id);
         try {
        	 
        	  Configuration configuration = new Configuration().configure();
	    	  Connection connection = dataSource.getConnection();
	    	  SchemaExport export = new SchemaExport(configuration,connection);
	    	  export.setOutputFile("C:\\Users\\Pc\\Documents\\schemamy-schema.sql");
	    	  export.setDelimiter(";");
	    	  export.execute(true, true, false, true);
	    	  
			return dataSource.getConnection();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
         
         return null;
     }
	
	//Recupera o data source de acordo com o tenantIdentifier
	public  DataSource getDataSource(String tenantIdentifier) {
		 ComboPooledDataSource defaultDataSource;
		 
		 PooledDataSource pds = C3P0Registry.pooledDataSourceByName(tenantIdentifier);
	      if(pds==null){
	    	  defaultDataSource = new ComboPooledDataSource(tenantIdentifier);
	    	  defaultDataSource.setJdbcUrl(DataBaseUtil.getDbConnectionString()+ tenantIdentifier);
	    	  defaultDataSource.setUser("root");
	    	  defaultDataSource.setPassword("leghacy123");
	    	  defaultDataSource.setTestConnectionOnCheckout(true);
	    	  //defaultDataSource.setInitialPoolSize(16);
	    	  defaultDataSource.setMaxConnectionAge(10000);
	    	  defaultDataSource.setPreferredTestQuery( "SELECT 1" );
	    	  try {
	        	 defaultDataSource.setDriverClass("com.mysql.jdbc.Driver");
	          } catch (Exception e) {
	              // TODO Auto-generated catch block
	              e.printStackTrace();
	          }
	    	  
	    	  //Atualiza o schema para o usuário
	    	  try {
	    		System.out.println("Iniciando atualização para "+tenantIdentifier);  
				updateSchema(defaultDataSource, tenantIdentifier);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    	  
	          return defaultDataSource;
	          
	      }
	     
	      return pds;
	          
	        

	  }
	
	
	//Verifica se existe determinado schema na base
	public static boolean existeSchema(String nomeSchema) throws SQLException{
		
		  if(!nomeSchema.contains(DB_PREFIX))
			  nomeSchema = DB_PREFIX + nomeSchema;
		
		  
		boolean existe = getConnection().createStatement().executeQuery("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '"+nomeSchema+"'").next();
		  
		return existe;

	}
	
	public void createSchema (UserSystem user) throws SQLException{
		
		String nomeDb = DB_PREFIX + user.getLogin();
		
		//Verifica se já existe schema criado
		if(existeSchema(nomeDb)){
			 //Atualiza o banco de dados
	        updateSchema((ComboPooledDataSource) getDataSource(nomeDb),nomeDb);
			return;
		}
	   
		//Dados padrão
		ResourceDatabasePopulator rdp = new ResourceDatabasePopulator();    
		rdp.addScript(new ClassPathResource("usuarioCeasa.sql"));
		rdp.setSqlScriptEncoding("UTF-8");
		

        Statement stm = getConnection().createStatement();
        
        // Criar o Schema para o novo usuário
        stm.execute("CREATE DATABASE IF NOT EXISTS " + nomeDb);
        
        stm.execute("USE " + nomeDb);
                rdp.populate(connection);
        
        //Alterar login padrão
        stm.execute("update pessoa set nome='"+user.getNome().split(" ")[0]+"', login = '"+user.getLogin()+"', senha='123',defaultPassword=1 where id=1 ");
        
        //Atualiza o banco de dados
        updateSchema((ComboPooledDataSource) getDataSource(nomeDb),nomeDb);
        
        try{
	        stm.close();
        }
        catch(Exception e){
        	
        }
       
	}
	
	public   void updateSchema(ComboPooledDataSource dataSource, String tenantId ) throws SQLException {
		
		
		
		LocalSessionFactoryBean sessionFactory  = (LocalSessionFactoryBean) SpringUtil.getBean("&sessionFactorySchemaManager");
		
		sessionFactory.setDataSource(dataSource);
		
		Configuration _configuration = sessionFactory.getConfiguration();
		
	    if(_configuration != null && dataSource != null) {

	        // Get a local configuration to configure
	        final Configuration tenantConfig = _configuration;

	        // Set the properties for this configuration
	        Properties props = new Properties();
	        props.put(Environment.DEFAULT_SCHEMA, tenantId);
	        props.put("hibernate.connection.url", dataSource.getJdbcUrl());
	        props.put("hibernate.connection.username",dataSource.getUser());
	        props.put("hibernate.connection.password",dataSource.getPassword());
	        tenantConfig.addProperties(props);
	       

	        // Get connection
	        Connection connection = DriverManager.getConnection(dataSource.getJdbcUrl(), 
	                dataSource.getUser(), dataSource.getPassword());

	        // Create the schema
	        connection.createStatement().execute("CREATE DATABASE IF NOT EXISTS " + tenantId + "");

	        // Run the schema update from configuration
	        SchemaUpdate schemaUpdate = new SchemaUpdate(tenantConfig);
	        schemaUpdate.execute(true, true);

	     

	    } else if(_configuration == null) {
	      
	           System.out.println("Configuração na Espeficada para " + dataSource.getUser());
	        
	    } else if(dataSource == null) {
	        
	            System.out.println("Data Source não especificado para  " +dataSource.getUser());
	        
	    }
     }
	
}
