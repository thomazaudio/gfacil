package teste;
import org.springframework.stereotype.Repository;
import model.GenericDAO;

@Repository
public class TestDefinitionDAO extends GenericDAO<TestDefinition> {

	public TestDefinitionDAO() {
		super(TestDefinition.class);
		// TODO Auto-generated constructor stub
	}
	

}


