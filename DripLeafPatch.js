/**
 * @author: CJXPJ
 * @date: 2025-2-15
 * @description: 大型垂滴叶和区块加载修复刷物
 * @version: 1.0.0
**/


mc.listen("onHopperSearchItem", (pos, isMinecart) => {
    if (!isMinecart) {
        const block = mc.getBlock(pos.add({ y: 1 }));
        if (!["minecraft:chest", "minecraft:trapped_chest"].includes(block.type)) return;
        const nbt =
            block.getBlockEntity().getNbt(),
            pairx = nbt.getData("pairx"),
            pairz = nbt.getData("pairz");
        if (!pairx || !pairz) return;
        if (mc.getBlock(pairx, block.pos.y, pairz, block.pos.dimid) !== undefined) {
            return false;
        }
    }
});

FloatPos.prototype.add = function ({ x = 0, y = 0, z = 0 }) {
    return new FloatPos(this.x + x, this.y + y, this.z + z, this.dimid);
};


try {
    // 创建一个存储方块时间戳的JSON对象
    blockTimestamps = {};

    // setInterval(() => {
    //     log(blockTimestamps);
    // }, 1000);

    mc.listen("onBlockChanged", (block, block2) => {
        if (block.type == "minecraft:big_dripleaf" && block2.type == "minecraft:big_dripleaf") {
            const now = Date.now(); // 获取当前时间戳（毫秒）
            const blockKey = block.type + block.pos.x + block.pos.y + block.pos.z + block.pos.dimid; // 创建一个唯一标识符

            if (blockTimestamps[blockKey] && now - blockTimestamps[blockKey] < 100) {
                if (!mc.getBlock(block.pos.x, block.pos.y + 1, block.pos.z, block.pos.dimid).isAir) {
                    log("BUG!!!" + block2.pos.x, "/", block2.pos.y, "/", block2.pos.z, "/", block2.pos.dimid);
                    block2.destroy(true);
                }
                delete blockTimestamps[blockKey];
            } else {
                // 清除超时数据
                for (const key in blockTimestamps) {
                    if (blockTimestamps[key] && now - blockTimestamps[key] > 100) {
                        delete blockTimestamps[key];
                    }
                }
            }
            blockTimestamps[blockKey] = now; // 更新该方块组合的时间戳
        }
    });
} catch (e) {
    log(e);
}