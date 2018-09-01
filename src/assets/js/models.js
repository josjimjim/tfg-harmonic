/**
 * Simple pendulum acceleration equation
 * 
 * @param {*} g - Gravity
 * @param {*} t - Time
 * @param {*} d - Damping
 * @param {*} m - Mass
 * @param {*} l - Length
 * @param {*} x - Angle
 * @param {*} v - Velocity
 * @return Pendulum acceleration
 */
export function simplePendulum(g, t, d, m, l, x, v) {
    return - g * Math.sin(x) / l - d / m * v;
}

/**
 * Spring pendulum acceleration equations
 * 
 * @param {*} eq - Equation selector. Ball: 1, Spring: 2
 * @param {*} g - Gravity
 * @param {*} t - Time
 * @param {*} d - Damping
 * @param {*} m - Mass
 * @param {*} l - Length
 * @param {*} k - Stiffness
 * @param {*} x1 - Angle
 * @param {*} v1 - Velocity
 * @param {*} x2 - Elongation
 * @param {*} v2 - Elongation velocity
 * @return Pendulum acceleration
 */
export function springPendulum(eq, g, t, d, m, l, k, x1, v1, x2, v2) {

    // Ball motion equation
    let b1 = g * Math.sin(x1);
    let b2 = 2 * v2 * v1;
    let b3 = (l + x2);
    let ball = (- b1 - b2) / b3 - d / m * v1;

    // Spring motion equation
    let s1 = (l + x2) * Math.pow(v1, 2);
    let s2 = g * Math.cos(x1);
    let s3 = k * x2 / m
    let spring = s1 + s2 - s3 - d / m * v2;

    let result;
    switch (eq) {
        case 1: result = ball; break;
        case 2: result = spring; break;
        default: result = ball;
    }
    return result;
}

/**
 * Double pendulum acceleration equations
 * 
 * @param {*} eq - Equation selector. Top: 1, Bottom: 2
 * @param {*} g - Gravity
 * @param {*} t - Time
 * @param {*} d - Damping
 * @param {*} m1 - Top pendulum mass
 * @param {*} l1 - Top pendulum length
 * @param {*} x1 - Top pendulum angle
 * @param {*} v1 - Top pendulum velocity
 * @param {*} m2 - Bottom pendulum mass
 * @param {*} l2 - Bottom pendulum length
 * @param {*} x2 - Bottom pendulum angle
 * @param {*} v2 - Bottom pendulum velocity
 * @return Pendulum acceleration
 */
export function doublePendulum(eq, g, t, d, m1, l1, x1, v1, m2, l2, x2, v2) {

    // Top pendulum equation
    let t1 = Math.pow(v1, 2) * l1 * m2 * Math.cos(x1 - x2) * Math.sin(x1 - x2);
    let t2 = g * m2 * Math.sin(x2) * Math.cos(x1 - x2);
    let t3 = Math.pow(v2, 2) * l2 * Math.sin(x1 - x2) * m2;
    let t4 = g * (m1 + m2) * Math.sin(x1);
    let t5 = l1 * (m1 + m2) - l1 * m2 * Math.pow(Math.cos(x1 - x2), 2);
    let top = ((- t1 + t2 - t3 - t4) / t5) - d / m1 * v1;

    // Bottom pendulum equation
    let b1 = Math.pow(v2, 2) * l2 * m2 * Math.cos(x1 - x2) * Math.sin(x1 - x2)
    let b2 = g * (m1 + m2) * Math.sin(x1) * Math.cos(x1 - x2)
    let b3 = Math.pow(v1, 2) * l1 * Math.sin(x1 - x2) * (m1 + m2)
    let b4 = g * (m1 + m2) * Math.sin(x2)
    let b5 = l2 * (m1 + m2) - l2 * m2 * Math.pow(Math.cos(x1 - x2), 2)
    let bot = ((b1 + b2 + b3 - b4) / b5) - d / m2 * v2

    let result;
    switch (eq) {
        case 1: result = top; break;
        case 2: result = bot; break;
        default: result = top;
    }
    return result;
}

/**
 * Triple pendulum acceleration equations
 * 
 * @param {*} eq - Equation selector. Amplitude: 1, Rotation: 2
 * @param {*} g - Gravity
 * @param {*} t - Time
 * @param {*} d - Damping
 * @param {*} m1 - Top pendulum mass
 * @param {*} l1 - Top pendulum length
 * @param {*} x1 - Top pendulum angle
 * @param {*} v1 - Top pendulum velocity
 * @param {*} m2 - Middle pendulum mass
 * @param {*} l2 - Middle pendulum length
 * @param {*} x2 - Middle pendulum angle
 * @param {*} v2 - Middle pendulum velocity
 * @param {*} m3 - Bottom pendulum mass
 * @param {*} l3 - Bottom pendulum length
 * @param {*} x3 - Bottom pendulum angle
 * @param {*} v3 - Bottom pendulum velocity
 * @return Pendulum acceleration
 */
export function triplePendulum(eq, g, t, d, m1, l1, x1, v1, m2, l2, x2, v2, m3, l3, x3, v3) {

    let w1 = v1 * d // DAMPING
    let a1 = g * (m1 + m2 + m3) * Math.sin(x1)
    let b1 = l2 * (m2 + m3) * Math.sin(x1 - x2) * Math.pow(v2, 2)
    let c1 = l3 * m3 * Math.sin(x1 - x3) * Math.pow(v3, 2)
    let d1 = (l1 * m1 + (m2 + m3) * l1) //* acc1 
    let e1 = (m2 + m3) * l2 * Math.cos(x1 - x2) //* acc2
    let f1 = l3 * m3 * Math.cos(x1 - x3) //* acc3

    let w2 = v2 * d // DAMPING
    let a2 = l1 * (m2 + m3) * Math.sin(x1 - x2) * Math.pow(v1, 2)
    let b2 = l3 * m3 * Math.sin(x2 - x3) * Math.pow(v3, 2)
    let c2 = (m2 + m3) * g * Math.sin(x2)
    let d2 = (m2 + m3) * l1 * Math.cos(x1 - x2)// * acc1
    let e2 = (m2 + m3) * l2// * acc2
    let f2 = l3 * m3 * Math.cos(x2 - x3)// * acc3

    let w3 = v3 * d // g
    let a3 = m3 * g * Math.sin(x3)
    let b3 = m3 * l1 * Math.sin(x1 - x3) * Math.pow(v1, 2)
    let c3 = m3 * l2 * Math.sin(x2 - x3) * Math.pow(v2, 2)
    let d3 = m3 * l1 * Math.cos(x1 - x3) //* acc1
    let e3 = m3 * l2 * Math.cos(x2 - x3) //* acc2
    let f3 = m3 * l3 //* acc3

    // Top pendulum equation
    let top = -((e3 * f2 - e2 * f3) * a1 + (e3 * f2 - e2 * f3) * b1 + (e3 * f2 - e2 * f3) * c1
        - ((a3 - b3 - c3 + w3) * f2 + a2 * f3 - b2 * f3 - c2 * f3 - f3 * w2) * e1 + ((a3 -
            b3 - c3 + w3) * e2 + a2 * e3 - b2 * e3 - c2 * e3 - e3 * w2) * f1 + (e3 * f2 -
                e2 * f3) * w1) / ((e3 * f2 - e2 * f3) * d1 - (d3 * f2 - d2 * f3) * e1 + (d3 * e2 -
                    d2 * e3) * f1);

    // Middle pendulum equation
    let mid = ((d3 * f2 - d2 * f3) * a1 + (d3 * f2 - d2 * f3) * b1 + (d3 * f2 -
        d2 * f3) * c1 - ((a3 - b3 - c3 + w3) * f2 + a2 * f3 - b2 * f3 - c2 * f3 - f3 * w2) * d1
        + ((a3 - b3 - c3 + w3) * d2 + a2 * d3 - b2 * d3 - c2 * d3 - d3 * w2) * f1 + (d3 * f2 -
            d2 * f3) * w1) / ((e3 * f2 - e2 * f3) * d1 - (d3 * f2 - d2 * f3) * e1 + (d3 * e2 -
                d2 * e3) * f1);

    // Bottom pendulum equation
    let bot = -((d3 * e2 - d2 * e3) * a1 + (d3 * e2 - d2 * e3) * b1 + (d3 * e2 -
        d2 * e3) * c1 - ((a3 - b3 - c3 + w3) * e2 + a2 * e3 - b2 * e3 - c2 * e3 - e3 * w2) * d1
        + ((a3 - b3 - c3 + w3) * d2 + a2 * d3 - b2 * d3 - c2 * d3 - d3 * w2) * e1 + (d3 * e2 -
            d2 * e3) * w1) / ((e3 * f2 - e2 * f3) * d1 - (d3 * f2 - d2 * f3) * e1 + (d3 * e2 -
                d2 * e3) * f1);

    let result;
    switch (eq) {
        case 1: result = top; break;
        case 2: result = mid; break;
        case 3: result = bot; break;
        default: result = top;
    }
    return result;
}

/**
 * Spherical pendulum acceleration equations
 * 
 * @param {*} g - Gravity
 * @param {*} t - Time
 * @param {*} d - Damping
 * @param {*} m - Mass
 * @param {*} l - Length
 * @param {*} x1 - Amplitude angle 
 * @param {*} v1 - Amplitude velocity
 * @param {*} x2 - Rotation angle
 * @param {*} v2 - Rotation velocity
 * @return Pendulum acceleration
 */
export function sphericalPendulum(eq, g, t, d, m, l, x1, v1, x2, v2) {

    // Amplitude variation equation      
    let amp = Math.pow(v2, 2) * Math.sin(x1) * Math.cos(x1) - g * Math.sin(x1) / l

    // Rotation variation equation
    let rot = -2 * v1 * v2 / Math.tan(x1)

    let result;
    switch (eq) {
        case 1: result = amp; break;
        case 2: result = rot; break;
        default: result = amp;
    }
    return result;
}