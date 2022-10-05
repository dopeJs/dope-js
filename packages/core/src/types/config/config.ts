import { InputConfig, NormalizedInputConfig } from './input'
import { NormalizedOutputConfig, OutputConfig } from './output'
import { CommonServerConfig, DevServerConfig, NormalizeCommonServerConfig, NormalizeDevServerConfig } from './server'

export interface DopeConfig extends InputConfig {
  outputs?: OutputConfig | Array<OutputConfig>
  devServer?: DevServerConfig
  preview: CommonServerConfig
}

export interface NormalizeDopeConfig extends NormalizedInputConfig {
  outputs: Array<NormalizedOutputConfig>
  devServer: NormalizeDevServerConfig
  preview: NormalizeCommonServerConfig
}
