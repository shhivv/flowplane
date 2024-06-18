use lancedb::connect;
use lancedb::Connection;

pub async fn connect_vdb() -> Connection {
  let binding = BaseDirs::new().unwrap();
  let mut app_dir = PathBuf::from(binding.data_dir());

  app_dir.push(".flowplane");
  app_dir.push("vector.db");

  let db = connect(app_dir).execute().await.unwrap();
  return db
}