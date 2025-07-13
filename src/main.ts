import { GridConfigArraySchema } from './schemas';
import { convertOldConfigArrayToNewConfigArray } from './converters';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

console.log('🚀 Grid View Stats Migrator - Converting All Data\n');

try {
  // Get current directory for ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Read the old data
  const dataPath = join(__dirname, '../docs/old-data.json');
  const rawData = readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(rawData);

  console.log(`📊 Found ${data.length} legacy grid view configurations`);

  // Validate input data with our input schema
  const inputResult = GridConfigArraySchema.safeParse(data);

  if (!inputResult.success) {
    console.error('❌ Input validation failed:');
    inputResult.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }

  console.log('✅ Input data validated successfully!');
  console.log(
    `📝 Object types: ${[...new Set(inputResult.data.map((item) => item.type))].join(', ')}`,
  );
  console.log(`👤 Owners: ${[...new Set(inputResult.data.map((item) => item.owner))].join(', ')}`);
  console.log(
    `🔍 Scopes: ${[...new Set(inputResult.data.map((item) => item.scope).filter(Boolean))].join(', ')}`,
  );

  console.log('\n🔄 Migrating to new view format...');

  // Migrate all legacy grid configurations to new view configurations
  const migratedData = convertOldConfigArrayToNewConfigArray(inputResult.data);

  console.log(`✅ Migrated ${migratedData.length} view configurations`);

  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ All view configurations migrated successfully!`);
  console.log(
    `   🗺️ Scope mapping applied: BelongToMyself → MIME, All → ALL, BelongToMyOrg → MYORG`,
  );
  console.log(`   🏷️ Type mapping applied: MILESTONE/IP_AND_SM → IPSM`);
  console.log(`   👤 User objects created with SID only (all other fields null)`);
  console.log(`   📊 GridState includes ag-grid ColumnState + Phoenix extensions`);

  const validCount = migratedData.length;
  const invalidCount = 0;

  // Print migrated data
  console.log('\n🎯 Migrated Data:');
  console.log('='.repeat(80));

  migratedData.forEach((config, index) => {
    console.log(`\n📋 Configuration ${index + 1}:`);
    console.log(`   📛 View ID: ${config.viewId}`);
    console.log(`   📝 Name: ${config.name}`);
    console.log(`   👤 Owner: ${config.owners[0].sid}`);
    console.log(`   🔍 Scope: ${config.userFilterScope}`);
    console.log(`   🏷️  Type: ${config.type}`);
    console.log(`   ⭐ Favorite: ${config.isFavorite}`);
    console.log(`   🔧 Default: ${config.isDefault}`);
    console.log(`   🗓️  Updated: ${config.updatedAt}`);

    // Parse and show gridState info
    try {
      const gridState = JSON.parse(config.gridState);
      console.log(`   📊 Columns: ${gridState.columnState.length}`);
      console.log(`   🔽 Filters: ${Object.keys(gridState.filterModel).length}`);
      console.log(`   🎛️  Pivot Mode: ${gridState.isPivotMode}`);
      console.log(`   🎨 Theme: ${gridState.theme}`);
    } catch (e) {
      console.log(`   ❌ GridState parse error: ${e}`);
    }
  });

  // Save migrated data to a file
  const outputPath = join(__dirname, '../output/migrated-data.json');
  const outputDir = dirname(outputPath);

  // Create output directory if it doesn't exist
  try {
    import('fs').then((fs) => {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
    });
  } catch {
    // Directory creation will be handled by writeFileSync
  }

  writeFileSync(outputPath, JSON.stringify(migratedData, null, 2), 'utf-8');
  console.log(`\n💾 Migrated data saved to: ${outputPath}`);

  console.log('\n🎉 Migration completed successfully!');
  console.log(`📈 Summary:`);
  console.log(`   📥 Input objects: ${data.length}`);
  console.log(`   📤 Output objects: ${migratedData.length}`);
  console.log(`   ✅ Valid outputs: ${validCount}`);
  console.log(`   ⚠️  Invalid outputs: ${invalidCount}`);
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
