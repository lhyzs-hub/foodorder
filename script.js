// 菜品数据 - 按地点分类
const menuItems = {
    // 泡馍类 - 银泉食堂二楼西北风味
    'yangroupaomo-small': {
        name: '羊肉泡馍',
        size: '小份',
        price: 19.00,
        waitTime: 5,
        category: 'paomo',
        location: '银泉食堂二楼',
        quantity: 0
    },
    'yangroupaomo-large': {
        name: '羊肉泡馍',
        size: '大份',
        price: 28.00,
        waitTime: 6,
        category: 'paomo',
        location: '银泉食堂二楼',
        quantity: 0
    },
    'niupaomo-small': {
        name: '牛肉泡馍',
        size: '小份',
        price: 19.00,
        waitTime: 5,
        category: 'paomo',
        location: '银泉食堂二楼',
        quantity: 0
    },
    'niupaomo-large': {
        name: '牛肉泡馍',
        size: '大份',
        price: 28.00,
        waitTime: 6,
        category: 'paomo',
        location: '银泉食堂二楼',
        quantity: 0
    },
    // 披萨类 - 银泉食堂一楼西餐厅
    'margherita-pizza': {
        name: '玛格丽特披萨',
        price: 16.00,
        waitTime: 8,
        category: 'pizza',
        location: '银泉食堂一楼',
        quantity: 0
    },
    'pineapple-pizza': {
        name: '菠萝披萨',
        price: 18.00,
        waitTime: 8,
        category: 'pizza',
        location: '银泉食堂一楼',
        quantity: 0
    },
    'durian-pizza': {
        name: '榴莲披萨',
        price: 25.00,
        waitTime: 10,
        category: 'pizza',
        location: '银泉食堂一楼',
        quantity: 0
    }
};

// 限购配置 - 按地点独立限购
const LOCATION_LIMITS = {
    paomo: {
        limit: 2,
        locationName: '银泉食堂二楼',
        description: '该档口单人限购2份'
    },
    pizza: {
        limit: 2,
        locationName: '银泉食堂一楼',
        description: '该档口单人限购2份'
    }
};

// 高峰时段配置
const PEAK_HOURS = {
    lunch: { start: 12, end: 12.5 }, // 12:00-12:30
    dinner: { start: 18, end: 18.5 }  // 18:00-18:30
};

// 存储各档口前面排队信息
let queueInfo = {
    paomo: {
        queueCount: 0,
        queueTime: 0
    },
    pizza: {
        queueCount: 0,
        queueTime: 0
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);
    checkPeakHours();
    setInterval(checkPeakHours, 60000);
    initializeQueueInfo();
    updateAllQueueDisplay();
    setInterval(updateQueueInfo, 30000); // 每30秒更新一次排队信息
});

// 初始化排队信息
function initializeQueueInfo() {
    updateQueueInfo();
}

// 更新排队信息 - 随机生成前面等待人数和时间
function updateQueueInfo() {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const isPeakTime = (currentHour >= PEAK_HOURS.lunch.start && currentHour < PEAK_HOURS.lunch.end) ||
                      (currentHour >= PEAK_HOURS.dinner.start && currentHour < PEAK_HOURS.dinner.end);
    
    // 根据时段调整等待人数范围
    let paomoRange, pizzaRange;
    
    if (isPeakTime) {
        paomoRange = { min: 5, max: 10 };
        pizzaRange = { min: 6, max: 12 };
    } else {
        paomoRange = { min: 1, max: 4 };
        pizzaRange = { min: 2, max: 5 };
    }
    
    // 随机生成泡馍档口排队信息
    queueInfo.paomo.queueCount = Math.floor(Math.random() * (paomoRange.max - paomoRange.min + 1)) + paomoRange.min;
    queueInfo.paomo.queueTime = calculateQueueTime('paomo', queueInfo.paomo.queueCount);
    
    // 随机生成披萨档口排队信息
    queueInfo.pizza.queueCount = Math.floor(Math.random() * (pizzaRange.max - pizzaRange.min + 1)) + pizzaRange.min;
    queueInfo.pizza.queueTime = calculateQueueTime('pizza', queueInfo.pizza.queueCount);
    
    updateAllQueueDisplay();
}

// 计算排队等待时间（根据人数和平均每份制作时间估算）
function calculateQueueTime(category, count) {
    // 假设每个档口平均每份制作时间
    const avgTimePerOrder = {
        paomo: 5,    // 泡馍平均5分钟一份
        pizza: 8     // 披萨平均8分钟一份
    };
    
    // 考虑高峰时段增加等待时间
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const isPeakTime = (currentHour >= PEAK_HOURS.lunch.start && currentHour < PEAK_HOURS.lunch.end) ||
                      (currentHour >= PEAK_HOURS.dinner.start && currentHour < PEAK_HOURS.dinner.end);
    
    let baseTime = count * avgTimePerOrder[category];
    
    // 高峰时段增加30%等待时间
    if (isPeakTime) {
        baseTime = Math.round(baseTime * 1.3);
    }
    
    return baseTime;
}

// 更新排队信息显示（仅订单界面）
function updateAllQueueDisplay() {
    updateOrderSummaryQueueInfo();
}

// 更新订单汇总中的排队信息
function updateOrderSummaryQueueInfo() {
    const paomoQuantityElement = document.getElementById('paomoQuantity');
    const paomoQueueCountElement = document.getElementById('paomoQueueCount');
    const paomoQueueTimeElement = document.getElementById('paomoQueueTime');
    
    const pizzaQuantityElement = document.getElementById('pizzaQuantity');
    const pizzaQueueCountElement = document.getElementById('pizzaQueueCount');
    const pizzaQueueTimeElement = document.getElementById('pizzaQueueTime');
    
    // 计算当前选择的泡馍和披萨数量
    let paomoQuantity = 0;
    let pizzaQuantity = 0;
    
    Object.values(menuItems).forEach(item => {
        if (item.category === 'paomo') {
            paomoQuantity += item.quantity;
        } else if (item.category === 'pizza') {
            pizzaQuantity += item.quantity;
        }
    });
    
    // 更新泡馍信息
    if (paomoQuantityElement) paomoQuantityElement.textContent = paomoQuantity;
    if (paomoQueueCountElement) paomoQueueCountElement.textContent = queueInfo.paomo.queueCount;
    if (paomoQueueTimeElement) {
        // 泡馍档口总等待时间 = 前面等待时间 + 当前订单的制作时间
        const paomoOrderTime = calculateLocationOrderTime('paomo');
        const paomoTotalTime = queueInfo.paomo.queueTime + paomoOrderTime;
        paomoQueueTimeElement.textContent = paomoTotalTime;
        
        if (paomoTotalTime <= 10) {
            paomoQueueTimeElement.style.color = '#2ED573';
        } else if (paomoTotalTime <= 20) {
            paomoQueueTimeElement.style.color = '#FFA502';
        } else {
            paomoQueueTimeElement.style.color = '#FF4757';
        }
    }
    
    // 更新披萨信息
    if (pizzaQuantityElement) pizzaQuantityElement.textContent = pizzaQuantity;
    if (pizzaQueueCountElement) pizzaQueueCountElement.textContent = queueInfo.pizza.queueCount;
    if (pizzaQueueTimeElement) {
        // 披萨档口总等待时间 = 前面等待时间 + 当前订单的制作时间
        const pizzaOrderTime = calculateLocationOrderTime('pizza');
        const pizzaTotalTime = queueInfo.pizza.queueTime + pizzaOrderTime;
        pizzaQueueTimeElement.textContent = pizzaTotalTime;
        
        if (pizzaTotalTime <= 10) {
            pizzaQueueTimeElement.style.color = '#2ED573';
        } else if (pizzaTotalTime <= 20) {
            pizzaQueueTimeElement.style.color = '#FFA502';
        } else {
            pizzaQueueTimeElement.style.color = '#FF4757';
        }
    }
}

// 计算某档口当前订单的制作时间（所有选中菜品的制作时间相加）
function calculateLocationOrderTime(category) {
    let orderTime = 0;
    
    Object.values(menuItems).forEach(item => {
        if (item.category === category && item.quantity > 0) {
            // 当前订单的制作时间 = 基础制作时间 + (数量-1) * 额外时间
            orderTime += item.waitTime + (item.quantity - 1) * 3;
        }
    });
    
    return orderTime;
}

// 计算某档口的总等待时间（前面等待 + 当前订单制作）
function calculateLocationTotalWaitTime(category) {
    const queueTime = queueInfo[category].queueTime;
    const orderTime = calculateLocationOrderTime(category);
    return queueTime + orderTime;
}

// 计算总等待时间 - 取两个档口中较长的那个
function calculateTotalWaitTime() {
    const paomoTotalTime = calculateLocationTotalWaitTime('paomo');
    const pizzaTotalTime = calculateLocationTotalWaitTime('pizza');
    
    return Math.max(paomoTotalTime, pizzaTotalTime);
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('currentTime').textContent = timeString;
}

// 检查是否在高峰时段
function checkPeakHours() {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const warningElement = document.getElementById('peakWarning');

    const isLunchPeak = currentHour >= PEAK_HOURS.lunch.start && currentHour < PEAK_HOURS.lunch.end;
    const isDinnerPeak = currentHour >= PEAK_HOURS.dinner.start && currentHour < PEAK_HOURS.dinner.end;

    if (isLunchPeak || isDinnerPeak) {
        const period = isLunchPeak ? '午餐' : '晚餐';
        warningElement.textContent = `🔥 ${period}高峰期，请合理安排时间`;
        warningElement.classList.add('active');
    } else {
        warningElement.classList.remove('active');
    }
}

// 获取某地点的总数量
function getLocationQuantity(category) {
    let total = 0;
    Object.entries(menuItems).forEach(([itemId, item]) => {
        if (item.category === category) {
            total += item.quantity;
        }
    });
    return total;
}

// 改变菜品数量
function changeQuantity(itemId, change) {
    const item = menuItems[itemId];
    if (!item) return;

    const currentQuantity = item.quantity;
    const newQuantity = currentQuantity + change;

    // 检查数量不能为负
    if (newQuantity < 0) return;

    // 获取该地点当前总数量
    const locationQuantity = getLocationQuantity(item.category);
    const limit = LOCATION_LIMITS[item.category].limit;

    // 检查该地点限购
    if (change > 0 && (locationQuantity + change) > limit) {
        showModal(`⚠️ ${LOCATION_LIMITS[item.category].locationName}单人限购${limit}份！<br>您当前已选${locationQuantity}份，还可以选${limit - locationQuantity}份。`, 'warning');
        return;
    }

    // 更新数量
    item.quantity = newQuantity;
    document.getElementById(`quantity-${itemId}`).textContent = newQuantity;

    // 更新订单显示
    updateOrderDisplay();
}

// 获取总数量
function getTotalQuantity() {
    return Object.values(menuItems).reduce((sum, item) => sum + item.quantity, 0);
}

// 计算总价
function calculateTotalPrice() {
    return Object.values(menuItems).reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// 更新订单显示
function updateOrderDisplay() {
    const orderItemsContainer = document.getElementById('orderItems');
    const totalQuantityElement = document.getElementById('totalQuantity');
    const totalWaitTimeElement = document.getElementById('totalWaitTime');
    const totalPriceElement = document.getElementById('totalPrice');
    const submitBtn = document.getElementById('submitBtn');
    const locationSummary = document.getElementById('locationSummary');

    // 清空订单列表
    orderItemsContainer.innerHTML = '';

    let hasItems = false;
    let paomoQuantity = 0;
    let pizzaQuantity = 0;

    // 按地点分组显示订单
    const paomoOrders = [];
    const pizzaOrders = [];

    Object.entries(menuItems).forEach(([itemId, item]) => {
        if (item.quantity > 0) {
            hasItems = true;
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            
            const displayName = item.size ? `${item.name}（${item.size}）` : item.name;
            
            orderItem.innerHTML = `
                <div style="flex: 1;">
                    <span class="order-item-name">${displayName}</span>
                    <span class="order-item-location">${item.location}</span>
                </div>
                <span class="order-item-quantity">×${item.quantity}</span>
                <span class="order-item-price">¥${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderItemsContainer.appendChild(orderItem);

            // 统计各地点数量
            if (item.category === 'paomo') {
                paomoQuantity += item.quantity;
            } else if (item.category === 'pizza') {
                pizzaQuantity += item.quantity;
            }
        }
    });

    if (!hasItems) {
        orderItemsContainer.innerHTML = '<p class="empty-cart">请选择菜品</p>';
        submitBtn.disabled = true;
        locationSummary.style.display = 'none';
    } else {
        submitBtn.disabled = false;
        locationSummary.style.display = 'block';
    }

    // 更新汇总信息
    const totalQuantity = getTotalQuantity();
    const totalWaitTime = calculateTotalWaitTime();
    const totalPrice = calculateTotalPrice();

    totalQuantityElement.textContent = totalQuantity;
    totalWaitTimeElement.textContent = `${totalWaitTime}分钟`;
    totalPriceElement.textContent = `¥${totalPrice.toFixed(2)}`;

    // 根据等待时间设置颜色
    if (totalWaitTime <= 10) {
        totalWaitTimeElement.style.color = '#2ED573';
    } else if (totalWaitTime <= 20) {
        totalWaitTimeElement.style.color = '#FFA502';
    } else {
        totalWaitTimeElement.style.color = '#FF4757';
    }
    
    // 更新订单汇总中的排队信息
    updateOrderSummaryQueueInfo();
}

// 提交订单
function submitOrder() {
    const totalQuantity = getTotalQuantity();
    const totalWaitTime = calculateTotalWaitTime();
    const totalPrice = calculateTotalPrice();

    // 按地点分组
    const paomoOrders = [];
    const pizzaOrders = [];

    Object.entries(menuItems).forEach(([itemId, item]) => {
        if (item.quantity > 0) {
            const orderInfo = {
                name: item.size ? `${item.name}（${item.size}）` : item.name,
                quantity: item.quantity,
                price: item.price * item.quantity,
                location: item.location
            };

            if (item.category === 'paomo') {
                paomoOrders.push(orderInfo);
            } else if (item.category === 'pizza') {
                pizzaOrders.push(orderInfo);
            }
        }
    });

    // 获取各地点等待信息
    const paomoQueueCount = queueInfo.paomo.queueCount;
    const paomoQueueTime = queueInfo.paomo.queueTime;
    const paomoOrderTime = calculateLocationOrderTime('paomo');
    const paomoTotalTime = paomoQueueTime + paomoOrderTime;
    
    const pizzaQueueCount = queueInfo.pizza.queueCount;
    const pizzaQueueTime = queueInfo.pizza.queueTime;
    const pizzaOrderTime = calculateLocationOrderTime('pizza');
    const pizzaTotalTime = pizzaQueueTime + pizzaOrderTime;

    // 构建订单详情
    let orderDetails = '<div style="text-align: left;">';
    orderDetails += '<h3 style="margin-bottom: 15px; color: #FF6B35;">📋 订单详情</h3>';

    // 泡馍订单
    if (paomoOrders.length > 0) {
        orderDetails += `
            <div style="margin-bottom: 15px;">
                <h4 style="color: #F7931E; margin-bottom: 10px;">🥘 银泉食堂二楼（西北风味）</h4>
                <div style="background: #FFF3E0; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>前方等待:</span>
                        <strong>${paomoQueueCount}人</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>前面等待:</span>
                        <strong>约${paomoQueueTime}分钟</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>您的制作:</span>
                        <strong>约${paomoOrderTime}分钟</strong>
                    </div>
                </div>
        `;
        paomoOrders.forEach(order => {
            orderDetails += `
                <div style="margin-bottom: 8px; padding: 8px; background: #F8F9FA; border-radius: 8px;">
                    <strong>${order.name}</strong> × ${order.quantity}<br>
                    <span style="color: #7F8C8D; font-size: 0.9rem;">小计: ¥${order.price.toFixed(2)}</span>
                </div>
            `;
        });
        orderDetails += `
                <div style="background: linear-gradient(135deg, #FFE5D9, #FFF0EB); padding: 8px; border-radius: 8px; text-align: center; margin-top: 10px;">
                    <strong>该档口总计:</strong> <span style="color: #FF6B35; font-weight: 700;">约${paomoTotalTime}分钟</span>
                </div>
            </div>
        `;
    }

    // 披萨订单
    if (pizzaOrders.length > 0) {
        orderDetails += `
            <div style="margin-bottom: 15px;">
                <h4 style="color: #F7931E; margin-bottom: 10px;">🍕 银泉食堂一楼（西餐厅）</h4>
                <div style="background: #FFF3E0; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>前方等待:</span>
                        <strong>${pizzaQueueCount}人</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>前面等待:</span>
                        <strong>约${pizzaQueueTime}分钟</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>您的制作:</span>
                        <strong>约${pizzaOrderTime}分钟</strong>
                    </div>
                </div>
        `;
        pizzaOrders.forEach(order => {
            orderDetails += `
                <div style="margin-bottom: 8px; padding: 8px; background: #F8F9FA; border-radius: 8px;">
                    <strong>${order.name}</strong> × ${order.quantity}<br>
                    <span style="color: #7F8C8D; font-size: 0.9rem;">小计: ¥${order.price.toFixed(2)}</span>
                </div>
            `;
        });
        orderDetails += `
                <div style="background: linear-gradient(135deg, #FFE5D9, #FFF0EB); padding: 8px; border-radius: 8px; text-align: center; margin-top: 10px;">
                    <strong>该档口总计:</strong> <span style="color: #FF6B35; font-weight: 700;">约${pizzaTotalTime}分钟</span>
                </div>
            </div>
        `;
    }

    orderDetails += `
        <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #E0E0E0;">
            <p><strong>总数量:</strong> ${totalQuantity}份</p>
            <p><strong>预估总等待:</strong> <span style="color: ${totalWaitTime <= 10 ? '#2ED573' : totalWaitTime <= 20 ? '#FFA502' : '#FF4757'}; font-weight: 700; font-size: 1.2rem;">约${totalWaitTime}分钟</span></p>
            <p style="font-size: 1.2rem; font-weight: 700; color: #FF6B35; margin-top: 10px;"><strong>总价:</strong> ¥${totalPrice.toFixed(2)}</p>
        </div>
    `;

    // 添加提醒
    if (totalWaitTime > 20) {
        orderDetails += `
            <div style="margin-top: 15px; padding: 10px; background: #FFF3E0; border-radius: 8px; border-left: 4px solid #FFA502;">
                <strong>⚠️ 温馨提示:</strong><br>
                当前等待时间较长，建议您合理安排时间，避免影响上课。
            </div>
        `;
    }

    orderDetails += '</div>';

    showModal(orderDetails, 'success');

    // 重置订单
    setTimeout(() => {
        Object.keys(menuItems).forEach(itemId => {
            menuItems[itemId].quantity = 0;
            document.getElementById(`quantity-${itemId}`).textContent = '0';
        });
        updateOrderDisplay();
    }, 3000);
}

// 显示弹窗
function showModal(content, type = 'info') {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');

    let icon = '';
    if (type === 'success') {
        icon = '<div style="text-align: center; margin-bottom: 15px;"><span style="font-size: 3rem;">✅</span></div>';
    } else if (type === 'warning') {
        icon = '<div style="text-align: center; margin-bottom: 15px;"><span style="font-size: 3rem;">⚠️</span></div>';
    } else {
        icon = '<div style="text-align: center; margin-bottom: 15px;"><span style="font-size: 3rem;">ℹ️</span></div>';
    }

    modalBody.innerHTML = icon + content;
    modal.classList.add('active');
}

// 关闭弹窗
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

// 点击弹窗外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}